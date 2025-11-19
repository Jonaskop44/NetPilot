import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  PageQueryDto,
  PaginatedUsersResponseDto,
  UserRoleEditDto,
} from './dto/admin.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RolesGuard } from 'src/guard/roles.guard';

@Roles(Role.ADMINISTRATOR)
@UseGuards(RolesGuard)
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of users',
    type: PaginatedUsersResponseDto,
  })
  async getAllUsers(@Query() query: PageQueryDto) {
    return this.adminService.getAllUsers(query.page);
  }

  @Patch('user/role/:id')
  @ApiOperation({ summary: 'Edit a user role' })
  async editUserRole(
    @Param('id') id: number,
    @Body() dto: UserRoleEditDto,
    @Request() request,
  ) {
    return this.adminService.editUserRole(id, dto.role, request);
  }
}
