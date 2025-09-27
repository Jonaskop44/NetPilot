import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import microsoftOauthConfig from './config/microsoft-oauth.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, MicrosoftStrategy],
  imports: [PassportModule, ConfigModule.forFeature(microsoftOauthConfig)],
})
export class AuthModule {}
