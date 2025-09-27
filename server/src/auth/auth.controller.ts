import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
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

    console.log('Microsoft login successful, user:', user);

    // Store user info in session
    (req.session as any).user = user;
    (req.session as any).isAuthenticated = true;

    res.redirect(process.env.FRONTEND_REDIRECT_URL as string);
  }

  @Get('user')
  async getCurrentUser(@Req() req: Request) {
    const session = req.session as any;
    if (session.isAuthenticated && session.user) {
      return {
        isAuthenticated: true,
        user: session.user,
      };
    }
    return { isAuthenticated: false };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  }
}
