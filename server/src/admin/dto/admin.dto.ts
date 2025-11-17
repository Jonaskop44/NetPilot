import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

export class PageQueryDto {
  @ApiProperty({ example: 1, description: 'Page number', required: true })
  @IsNumber()
  @Min(1, { message: 'Page must be at least 1' })
  page: number;
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
