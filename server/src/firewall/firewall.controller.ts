import { Controller, Get } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('firewall')
@Controller('firewall')
export class FirewallController {
  constructor(private readonly firewallService: FirewallService) {}

  @Get('rules')
  @ApiOperation({ summary: 'Get all firewall rules' })
  async getAllFirewallRules() {
    return this.firewallService.getAllFirewallRules();
  }
}
