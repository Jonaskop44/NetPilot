import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
