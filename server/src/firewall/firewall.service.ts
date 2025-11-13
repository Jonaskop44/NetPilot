import { Injectable } from '@nestjs/common';
import { OpnsenseClient } from './opnsense.client';

@Injectable()
export class FirewallService {
  private opnsenseClient = new OpnsenseClient();
  private client = this.opnsenseClient.getClient();

  async getAllFirewallRules() {
    return this.client.get('/firewall/rule/getAllRules');
  }
}
