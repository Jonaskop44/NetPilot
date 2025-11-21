import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { PageQueryDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(query: PageQueryDto) {
    const LIMIT = 10;
    const skip = (query.page - 1) * LIMIT;

    const whereClause = {
      AND: [
        query.filter
          ? {
              OR: [
                {
                  username: {
                    contains: query.filter,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  email: {
                    contains: query.filter,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            }
          : {},
        query.role ? { role: query.role } : {},
      ],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        take: LIMIT,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        where: whereClause,
      }),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      users,
      total,
      page: query.page,
      totalPages,
    };
  }

  async editUserRole(userId: number, role: Role, request: Request) {
    const user = request.session.user;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) throw new NotFoundException('User not found');

    if (userId === user?.id) {
      throw new ConflictException('You cannot change your own role');
    } else if (dbUser?.role === Role.ADMINISTRATOR) {
      const promotion = await this.prisma.userPromotion.findFirst({
        where: {
          userId: userId,
          promotedById: user?.id,
          toRole: Role.ADMINISTRATOR,
        },
      });

      if (!promotion) {
        throw new ConflictException(
          'You cannot change the role of another administrator that you did not promote',
        );
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    if (role === Role.ADMINISTRATOR) {
      await this.prisma.userPromotion.create({
        data: {
          userId: userId,
          promotedById: user!.id,
          toRole: role,
        },
      });
    }

    return updatedUser;
  }

  async deleteUser(userId: number, request: Request) {
    const user = request.session.user;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) throw new NotFoundException('User not found');

    if (userId === user?.id) {
      throw new ConflictException('You cannot delete your own account');
    } else if (dbUser?.role === Role.ADMINISTRATOR) {
      throw new ConflictException(
        'You cannot delete another administrator account',
      );
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
