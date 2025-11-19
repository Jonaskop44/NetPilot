import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma';

export class UserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'provider-12345', description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ example: 'STUDENT', description: 'User role', enum: Role })
  role: Role;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
