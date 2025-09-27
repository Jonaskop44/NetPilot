import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MicrosoftAuthGuard } from 'src/guard/microsoft-auth.guard';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftLogin() {}

  @Get('microsoft/callback')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftCallback(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;
    res.redirect('http://localhost:3001/dashboard');
  }
}
