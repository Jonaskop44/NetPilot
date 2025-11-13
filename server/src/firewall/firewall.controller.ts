import { Controller, Get, Query } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FirewallRulesResponseDto } from './dto/firewall-rule.dto';

@ApiTags('firewall')
@Controller('firewall')
export class FirewallController {
  constructor(private readonly firewallService: FirewallService) {}

  @Get('rules')
  @ApiOperation({
    summary: 'Get all firewall rules',
    description:
      'Retrieves all firewall rules from OPNsense with optional interface filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved firewall rules',
    type: FirewallRulesResponseDto,
  })
  @ApiQuery({
    name: 'interface',
    required: false,
    description: 'Filter rules by interface name (e.g., lan, wan)',
    example: 'lan',
  })
  async getAllFirewallRules(@Query('interface') interfaceName?: string) {
    return this.firewallService.getAllFirewallRules(interfaceName);
  }
}
