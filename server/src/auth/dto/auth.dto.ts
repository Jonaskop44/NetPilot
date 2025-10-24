import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class AuthResponseDto {
  @ApiProperty({ example: true, description: 'Authentication status' })
  isAuthenticated: boolean;

  @ApiProperty({
    type: UserDto,
    description: 'Authenticated user',
    required: false,
  })
  user?: UserDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logout successful', description: 'Logout message' })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'Not authenticated', description: 'Error message' })
  error: string;
}
