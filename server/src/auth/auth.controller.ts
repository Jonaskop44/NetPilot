import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MicrosoftAuthGuard } from 'src/guard/microsoft-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftLogin() {}
}
