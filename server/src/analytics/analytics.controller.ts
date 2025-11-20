import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RolesGuard } from 'src/guard/roles.guard';
import { AnalyticsService } from './analytics.service';
import { DashboardStatisticsDto } from './dto/analytics.dto';

@Roles(Role.TEACHER, Role.ADMINISTRATOR)
@UseGuards(RolesGuard)
@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('statistics')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description: 'Retrieves statistics for users and firewall rules',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved dashboard statistics',
    type: DashboardStatisticsDto,
  })
  async getStatistics() {
    return this.analyticsService.getStatistics();
  }
}
