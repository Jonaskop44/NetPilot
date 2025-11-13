import { ApiProperty } from '@nestjs/swagger';

export class FirewallRuleDto {
  @ApiProperty({
    description: 'Unique identifier for the rule',
    example: 'ab7ba289-402d-4fe3-9f3f-2513d2ed84e8',
  })
  uuid: string;

  @ApiProperty({
    description: 'Whether the rule is enabled',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Rule action (Pass/Block)',
    example: 'Pass',
    enum: ['Pass', 'Block'],
  })
  action: string;

  @ApiProperty({
    description: 'Rule direction (in/out)',
    example: 'in',
    enum: ['in', 'out'],
  })
  direction: string;

  @ApiProperty({
    description: 'IP protocol version',
    example: 'IPv4',
  })
  ipprotocol: string;

  @ApiProperty({
    description: 'Interface name',
    example: 'LAN',
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
    example: '192.168.1.0/24',
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
    example: true,
    required: false,
  })
  log?: boolean;

  @ApiProperty({
    description: 'Category name',
    example: 'Web Traffic',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Number of packets matched',
    example: 1234,
    required: false,
  })
  packets?: number;

  @ApiProperty({
    description: 'Number of bytes matched',
    example: 567890,
    required: false,
  })
  bytes?: number;

  @ApiProperty({
    description: 'Number of active states',
    example: 5,
    required: false,
  })
  states?: number;
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

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 2,
  })
  totalPages: number;
}
