import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class RuleScheduleDto {
  @ApiProperty({
    description: 'When the rule will be reverted',
    example: '2025-11-19T19:30:00.000Z',
  })
  scheduledFor: Date;
}

export class FirewallRuleDto {
  @ApiProperty({
    description: 'Unique identifier for the rule',
    example: 'e855ff5f-47b7-4251-91e0-234b35da7853',
  })
  uuid: string;

  @ApiProperty({
    description: 'Whether the rule is enabled',
    example: '1',
  })
  enabled: string;

  @ApiProperty({
    description: 'Rule action (pass/block/reject)',
    example: 'Pass',
    enum: ['Pass', 'Block', 'Reject'],
  })
  action: string;

  @ApiProperty({
    description: 'Interface name',
    example: 'lan',
    required: false,
  })
  interface?: string;

  @ApiProperty({
    description: 'Rule description',
    example: 'Allow HTTPS traffic',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Active schedule for this rule',
    required: false,
    nullable: true,
    type: RuleScheduleDto,
  })
  schedule?: RuleScheduleDto | null;
}

export class FirewallRulesResponseDto {
  @ApiProperty({
    description: 'Total number of rules',
    example: 18,
  })
  total: number;

  @ApiProperty({
    description: 'List of firewall rules',
    type: [FirewallRuleDto],
  })
  rules: FirewallRuleDto[];
}

export class ToggleFirewallRuleDto {
  @ApiProperty({
    description: 'Result of the toggle operation',
    example: 'Enabled',
  })
  result: string;

  @ApiProperty({
    description: 'Indicates if the rule state was changed',
    example: true,
  })
  changed: boolean;
}

export class ScheduleRuleChangeDto {
  @ApiProperty({
    description: 'UUID of the firewall rule',
    example: 'e855ff5f-47b7-4251-91e0-234b35da7853',
  })
  @IsString()
  @IsNotEmpty()
  ruleUuid: string;

  @ApiProperty({
    description: 'Time when the rule should be reverted back (HH:mm format)',
    example: '18:00',
  })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  revertAt: string;
}

export class ScheduledRuleChangeResponseDto {
  @ApiProperty({
    description: 'ID of the scheduled change',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'UUID of the firewall rule',
    example: 'e855ff5f-47b7-4251-91e0-234b35da7853',
  })
  ruleUuid: string;

  @ApiProperty({
    description:
      'Action that will be performed (this reverts the immediate change)',
    example: 'enable',
  })
  action: string;

  @ApiProperty({
    description: 'When the rule will be reverted',
    example: '2025-11-20T18:00:00Z',
  })
  scheduledFor: Date;

  @ApiProperty({
    description: 'Whether the revert has been executed',
    example: false,
  })
  executed: boolean;

  @ApiProperty({
    description: 'When the revert was executed',
    example: null,
    required: false,
  })
  executedAt?: Date;
}
