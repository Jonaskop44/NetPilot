import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderId(providerId: string) {
    return this.prisma.user.findUnique({
      where: {
        providerId: providerId,
      },
    });
  }

  async createUser(profile: {
    oid: string;
    displayName: string;
    email: string;
  }) {
    const { oid, displayName, email } = profile;
    return this.prisma.user.create({
      data: {
        providerId: oid,
        username: displayName,
        email: email,
      },
    });
  }
}
