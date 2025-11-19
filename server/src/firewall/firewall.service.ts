import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OpnsenseClient } from './opnsense.client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleRuleChangeDto } from './dto/firewall-rule.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Request } from 'express';

@Injectable()
export class FirewallService {
  private opnsenseClient = new OpnsenseClient();
  private client = this.opnsenseClient.getClient();

  constructor(private readonly prisma: PrismaService) {}

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
    // Get current rule state
    const rulesResponse = await this.client.get('/firewall/filter/get');
    const rulesData = rulesResponse.data;

    if (!rulesData?.filter?.rules?.rule?.[uuid]) {
      throw new NotFoundException(`Rule with UUID ${uuid} not found`);
    }

    const response = await this.client.post(
      `/firewall/filter/toggleRule//${uuid}`,
    );
    const data = response.data;

    if (!data) {
      throw new NotFoundException('No data returned from OPNsense API');
    }

    // Apply changes
    await this.client.post('/firewall/filter/apply');

    return data;
  }

  async scheduleRuleChange(dto: ScheduleRuleChangeDto, request: Request) {
    const session = request.session;
    const userId = session.user?.id;

    // 1. Set rule to desired state immediately
    await this.toggleFirewallRule(dto.ruleUuid);

    // 2. Parse time string (HH:mm)
    const [hours, minutes] = dto.revertAt.split(':').map(Number);
    const now = new Date();
    const revertTime = new Date();
    revertTime.setHours(hours, minutes, 0, 0);

    // If the time is in the past today, schedule for tomorrow
    if (revertTime <= now) {
      throw new ConflictException('Revert time must be in the future');
    }

    // 3. Determine the reverse action
    const reverseAction = dto.action === 'enable' ? 'disable' : 'enable';

    // 4. Schedule the reverse change
    if (userId) {
      const scheduledChange = await this.prisma.scheduledRuleChange.create({
        data: {
          ruleUuid: dto.ruleUuid,
          action: reverseAction,
          scheduledFor: revertTime,
          createdBy: userId,
        },
      });

      return scheduledChange;
    }
  }

  async getScheduledChanges() {
    return this.prisma.scheduledRuleChange.findMany({
      where: {
        executed: false,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledChanges() {
    const now = new Date();
    const pendingChanges = await this.prisma.scheduledRuleChange.findMany({
      where: {
        executed: false,
        scheduledFor: {
          lte: now,
        },
      },
    });

    for (const change of pendingChanges) {
      try {
        await this.toggleFirewallRule(change.ruleUuid);

        await this.prisma.scheduledRuleChange.update({
          where: { id: change.id },
          data: {
            executed: true,
            executedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(
          `Failed to execute scheduled change ${change.id}:`,
          error,
        );
      }
    }
  }
}
