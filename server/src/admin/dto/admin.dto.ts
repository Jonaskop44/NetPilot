import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min, IsEnum } from 'class-validator';
import { Role } from 'generated/prisma';
import { UserDto } from 'src/user/dto/user.dto';

export class PageQueryDto {
  @ApiProperty({ example: 1, description: 'Page number', required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Page must be at least 1' })
  page: number;
}

export class UserRoleEditDto {
  @ApiProperty({
    example: Role.TEACHER,
    description: 'New role for the user',
    required: true,
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserDto] })
  users: UserDto[];

  @ApiProperty({ example: 100, description: 'Total number of users' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;
}
