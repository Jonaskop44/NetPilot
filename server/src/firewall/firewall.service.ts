import { Injectable, NotFoundException } from '@nestjs/common';
import { OpnsenseClient } from './opnsense.client';
import { FirewallRuleDto } from './dto/firewall-rule.dto';

@Injectable()
export class FirewallService {
  private opnsenseClient = new OpnsenseClient();
  private client = this.opnsenseClient.getClient();

  async getAllFirewallRules() {
    const response = await this.client.get('/firewall/filter/get');
    const data = response.data;

    if (!data?.filter?.rules?.rule) {
      console.error('Unexpected API response structure:', data);
      throw new NotFoundException('Invalid response from OPNsense API');
    }

    const rulesObject = data.filter.rules.rule;

    const allRules = Object.entries(rulesObject).map(
      ([uuid, ruleData]: [string, FirewallRuleDto]) => {
        const extractSelectedOption = (field: any) => {
          if (!field || typeof field !== 'object') return null;

          const selectedEntry = Object.entries(field).find(
            ([_, value]: [string, any]) => value.selected === '1',
          );

          return selectedEntry ? selectedEntry[0] : null;
        };

        return {
          uuid,
          enabled: ruleData.enabled === '1',
          action: extractSelectedOption(ruleData.action),
          direction: extractSelectedOption(ruleData.direction),
          ipprotocol: extractSelectedOption(ruleData.ipprotocol),
          protocol: extractSelectedOption(ruleData.protocol),
          source_net: ruleData.source_net ?? null,
          destination_net: ruleData.destination_net ?? null,
          description: ruleData.description ?? null,
          log: ruleData.log === '1',
        };
      },
    );

    return {
      total: allRules.length,
      rules: allRules,
    };
  }

  async toggleFirewallRule(uuid: string) {
    const response = await this.client.post(
      `/firewall/filter/toggleRule//${uuid}`,
    );
    const data = response.data;

    if (!data) {
      throw new NotFoundException('No data returned from OPNsense API');
    }

    return data;
  }
}
