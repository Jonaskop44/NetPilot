import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto, UserResponseErrorDto } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UserResponseErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: UserResponseErrorDto,
  })
  async getUserProfile(@Req() req: Request) {
    return this.userService.getUserProfile(req);
  }
}
