import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async generateTokens(user: User) {
    const payload: AuthJwtPayload = {
      id: user.id,
      sub: {
        username: user.username,
        email: user.email,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async handleMicrosoftLogin(profile: any) {
    const { oid, displayName, _json } = profile;
    const email =
      _json?.email || profile.emails?.[0]?.value || `${oid}@unknown.com`;

    console.log('Processing Microsoft login:', {
      oid,
      displayName,
      email,
      hasJsonEmail: !!_json?.email,
      hasEmailsArray: !!profile.emails,
    });

    let user = await this.userService.findByProviderId(oid);

    if (!user) {
      console.log('Creating new user with:', { oid, displayName, email });
      user = await this.userService.createUser({
        oid,
        displayName,
        email,
      });
      console.log('Created user:', user);
    } else {
      console.log('Found existing user:', user);
    }

    const tokens = await this.generateTokens(user);
    const { accessToken, refreshToken } = tokens;
    const { providerId, ...userInfo } = user;

    return {
      accessToken,
      refreshToken,
      user: userInfo,
    };
  }

  async validateRefreshToken(userId: number, token: string) {
    const userFromDb = await this.userService.getUserById(userId);
    if (userFromDb) {
      const isTokenValid = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenConfig.secret,
      });
      if (!isTokenValid) throw new UnauthorizedException('Invalid token');

      return userFromDb;
    }
  }
}
