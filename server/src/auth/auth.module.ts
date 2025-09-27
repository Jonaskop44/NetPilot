import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import microsoftOauthConfig from './config/microsoft-oauth.config';
import jwtConfig from './config/jwt.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, MicrosoftStrategy, RefreshJwtStrategy],
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(microsoftOauthConfig),
  ],
})
export class AuthModule {}
