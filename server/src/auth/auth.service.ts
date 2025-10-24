import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async handleMicrosoftLogin(profile: any) {
    const { oid, displayName, _json } = profile;
    const email =
      _json?.email || profile.emails?.[0]?.value || `${oid}@unknown.com`;

    let user = await this.userService.findByProviderId(oid);

    if (!user) {
      user = await this.userService.createUser({
        oid,
        displayName,
        email,
      });
    }

    return user;
  }

  async getCurrentUser(request: Request) {
    const session = request.session as any;
    if (session.isAuthenticated && session.user) {
      return {
        isAuthenticated: true,
        user: session.user,
      };
    }
    return { isAuthenticated: false };
  }
}
