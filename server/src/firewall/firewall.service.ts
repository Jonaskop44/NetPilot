import { Injectable } from '@nestjs/common';
import { OpnsenseClient } from './opnsense.client';
import {
  FirewallRulesResponseDto,
  FirewallRuleDto,
} from './dto/firewall-rule.dto';

@Injectable()
export class FirewallService {
  private opnsenseClient = new OpnsenseClient();
  private client = this.opnsenseClient.getClient();

  async getAllFirewallRules(interfaceName?: string) {
    const interfaceParam = interfaceName
      ? `&interface=${interfaceName.toLowerCase()}`
      : '';
    const response = await this.client.get(
      `/firewall/filter/search_rule?show_all=1${interfaceParam}`,
    );
    const data = response.data;

    console.log('Firewall rules data:', data);

    const rules: FirewallRuleDto[] = data.rows.map((rule: any) => ({
      uuid: rule.uuid,
      enabled: rule.enabled === '1',
      action: rule.action,
      direction: rule.direction,
      ipprotocol: rule.ipprotocol,
      interface: rule.interface,
      protocol: rule.protocol,
      source_net: rule.source_net || undefined,
      source_port: rule.source_port || undefined,
      destination_net: rule.destination_net || undefined,
      destination_port: rule.destination_port?.toString() || undefined,
      description: rule.description || undefined,
      log: rule.log,
      category: rule.category,
      packets: rule.packets,
      bytes: rule.bytes,
      states: rule.states,
    }));

    return {
      total: data.total,
      rules,
    };
  }
}
