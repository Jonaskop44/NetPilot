import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
    example: 'pass',
    enum: ['pass', 'block', 'reject'],
  })
  action: string;

  @ApiProperty({
    description: 'Rule direction (in/out)',
    example: 'in',
    enum: ['in', 'out'],
  })
  direction: string;

  @ApiProperty({
    description:
      'IP protocol version (inet=IPv4, inet6=IPv6, inet46=IPv4+IPv6)',
    example: 'inet',
    enum: ['inet', 'inet6', 'inet46'],
  })
  ipprotocol: string;

  @ApiProperty({
    description: 'Interface name',
    example: 'lan',
    required: false,
  })
  interface?: string;

  @ApiProperty({
    description: 'Protocol type',
    example: 'tcp',
    required: false,
  })
  protocol?: string;

  @ApiProperty({
    description: 'Source network/address',
    example: 'any',
    required: false,
  })
  source_net?: string;

  @ApiProperty({
    description: 'Source port',
    example: '22',
    required: false,
  })
  source_port?: string;

  @ApiProperty({
    description: 'Destination network/address',
    example: 'any',
    required: false,
  })
  destination_net?: string;

  @ApiProperty({
    description: 'Destination port',
    example: '443',
    required: false,
  })
  destination_port?: string;

  @ApiProperty({
    description: 'Rule description',
    example: 'Allow HTTPS traffic',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether logging is enabled',
    example: '1',
  })
  log: string;

  @ApiProperty({
    description: 'State type (keep state, sloppy state, etc.)',
    example: 'keep',
    required: false,
  })
  statetype?: string;

  @ApiProperty({
    description: 'State policy (default, if-bound, floating)',
    example: 'default',
    required: false,
  })
  state_policy?: string;

  @ApiProperty({
    description: 'Quick rule (process immediately)',
    example: true,
    required: false,
  })
  quick?: boolean;

  @ApiProperty({
    description: 'Gateway for this rule',
    example: 'None',
    required: false,
  })
  gateway?: string;

  @ApiProperty({
    description: 'Sequence number',
    example: '100',
    required: false,
  })
  sequence?: string;

  @ApiProperty({
    description: 'Categories assigned to this rule',
    example: [],
    required: false,
  })
  categories?: string[];
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
