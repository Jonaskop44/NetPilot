import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(page: number) {
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        take: LIMIT,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    return {
      users,
      total,
      page,
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
      throw new ConflictException(
        'You cannot change the role of another administrator',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
