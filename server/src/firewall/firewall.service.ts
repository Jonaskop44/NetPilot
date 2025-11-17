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
      throw new NotFoundException('Invalid response from OPNsense API');
    }

    const rulesObject = data.filter.rules.rule;

    const allRules = Object.entries(rulesObject).map(
      ([uuid, ruleData]: [string, any]) => {
        const extractSelectedOption = (field: any): string | undefined => {
          if (!field || typeof field !== 'object') return undefined;

          const selectedEntry = Object.entries(field).find(
            ([_, value]: [string, any]) => value.selected === 1,
          );

          return selectedEntry ? selectedEntry[0] : undefined;
        };

        return {
          uuid,
          enabled: ruleData.enabled === '1',
          action: extractSelectedOption(ruleData.action),
          direction: extractSelectedOption(ruleData.direction),
          ipprotocol: extractSelectedOption(ruleData.ipprotocol),
          interface: extractSelectedOption(ruleData.interface),
          protocol: extractSelectedOption(ruleData.protocol),
          source_net: ruleData.source_net || undefined,
          source_port: ruleData.source_port || undefined,
          destination_net: ruleData.destination_net || undefined,
          destination_port: ruleData.destination_port || undefined,
          description: ruleData.description || undefined,
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
