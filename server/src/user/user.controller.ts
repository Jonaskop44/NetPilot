import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(
    @Req() req: Request,
  ): Promise<{ id: string; name: string; email: string } | { error: string }> {
    const session = req.session as any;
    if (session.isAuthenticated && session.user) {
      const user = session.user as { id: string; name: string; email: string };
      return user;
    }
    return { error: 'Not authenticated' };
  }
}
