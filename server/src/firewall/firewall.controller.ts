import { Body, Controller, Get, Post } from '@nestjs/common';
import { FirewallService } from './firewall.service';

@Controller('firewall')
export class FirewallController {
  constructor(private readonly firewallService: FirewallService) {}

  @Get('test-connection')
  async testConnection() {
    const isConnected = await this.firewallService.testConnection();
    return {
      connected: isConnected,
      message: isConnected
        ? 'OPNsense API is reachable'
        : 'OPNsense API is not reachable',
    };
  }

  @Get('rules')
  async getRules() {
    return this.firewallService.getRules();
  }

  @Post('rules')
  async addRule(@Body() ruleDto: any) {
    return this.firewallService.addRule(ruleDto);
  }
}
