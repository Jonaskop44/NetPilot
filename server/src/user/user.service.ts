import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
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

  async getUserProfile(request: Request) {
    const session = request.session as any;

    if (!session.isAuthenticated || !session.user)
      throw new UnauthorizedException('Not authenticated');

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
