import { ApiProperty } from '@nestjs/swagger';

export class UserStatisticsDto {
  @ApiProperty({
    description: 'Total number of users',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Number of administrator users',
    example: 5,
  })
  administrators: number;

  @ApiProperty({
    description: 'Number of teacher users',
    example: 25,
  })
  teachers: number;

  @ApiProperty({
    description: 'Number of student users',
    example: 120,
  })
  students: number;
}

export class FirewallStatisticsDto {
  @ApiProperty({
    description: 'Total number of firewall rules',
    example: 45,
  })
  total: number;

  @ApiProperty({
    description: 'Number of enabled rules',
    example: 38,
  })
  enabled: number;

  @ApiProperty({
    description: 'Number of disabled rules',
    example: 7,
  })
  disabled: number;

  @ApiProperty({
    description: 'Number of scheduled rule changes',
    example: 3,
  })
  scheduled: number;
}

export class HourlySessionDto {
  @ApiProperty({
    description: 'Timestamp of the hour',
    example: '2025-11-21T11:00:00.000Z',
  })
  time: string;

  @ApiProperty({
    description: 'Number of sessions created in this hour',
    example: 4,
  })
  count: number;
}

export class DashboardStatisticsDto {
  @ApiProperty({
    description: 'User statistics',
    type: UserStatisticsDto,
  })
  users: UserStatisticsDto;

  @ApiProperty({
    description: 'Firewall statistics',
    type: FirewallStatisticsDto,
  })
  firewall: FirewallStatisticsDto;

  @ApiProperty({
    description: 'Hourly session statistics for today',
    type: [HourlySessionDto],
  })
  sessions: HourlySessionDto[];
}
