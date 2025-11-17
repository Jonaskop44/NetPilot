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
      identityMetadata:
        'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration',
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      redirectUrl: process.env.AZURE_REDIRECT_URL,
      allowHttpForRedirectUrl: true,
      responseType: 'code',
      responseMode: 'query',
      scope: ['profile', 'openid', 'email'],
      passReqToCallback: false,
      validateIssuer: false,
      isB2C: false,
      issuer: null,
      loggingLevel: 'info',
      loggingNoPII: false,
    });
  }

  async validate(profile: any) {
    return this.authService.handleMicrosoftLogin(profile);
  }
}
