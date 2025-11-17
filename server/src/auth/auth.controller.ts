import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MicrosoftAuthGuard } from 'src/guard/microsoft-auth.guard';
import type { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  LogoutResponseDto,
  ErrorResponseDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  @ApiExcludeEndpoint()
  async microsoftLogin() {}

  @Get('microsoft/callback')
  @UseGuards(MicrosoftAuthGuard)
  @ApiExcludeEndpoint()
  async microsoftCallback(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;

    // Store user info in session
    (req.session as any).user = user;
    (req.session as any).isAuthenticated = true;

    res.redirect(process.env.FRONTEND_REDIRECT_URL as string);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user or authentication status',
    type: AuthResponseDto,
  })
  async getCurrentUser(@Req() request: Request) {
    return this.authService.getCurrentUser(request);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Logout failed',
    type: ErrorResponseDto,
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  }
}
