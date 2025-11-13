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

  async getAllFirewallRules(
    interfaceName?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const params: any = { show_all: 1 };
    if (interfaceName) {
      params.interface = interfaceName.toLowerCase();
    }

    const response = await this.client.get('/firewall/filter/search_rule', {
      params,
    });
    const data = response.data;

    if (!data || !Array.isArray(data.rows)) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid response from OPNsense API');
    }

    const allRules: FirewallRuleDto[] = data.rows.map((rule: any) => ({
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

    // Server-side pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRules = allRules.slice(startIndex, endIndex);

    return {
      total: allRules.length,
      rules: paginatedRules,
      page,
      limit,
      totalPages: Math.ceil(allRules.length / limit),
    };
  }
}
