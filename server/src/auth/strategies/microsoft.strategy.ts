import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy } from 'passport-azure-ad';
import { AuthService } from '../auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(
  OIDCStrategy,
  'microsoft',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: '{YOUR_CLIENT_ID}',
      clientSecret: '{YOUR_CLIENT_SECRET}',
      callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
      resource: '00000002-0000-0000-c000-000000000000',
      tenant: 'contoso.onmicrosoft.com',
    });
  }

  async validate(profile: any) {
    return this.authService.handleMicrosoftLogin(profile);
  }
}
