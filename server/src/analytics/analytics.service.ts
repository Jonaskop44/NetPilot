import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma';
import { FirewallService } from 'src/firewall/firewall.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firewallService: FirewallService,
  ) {}

  async getStatistics() {
    const [userStats, firewallStats] = await Promise.all([
      this.getUserStatistics(),
      this.getFirewallStatistics(),
    ]);

    return {
      users: userStats,
      firewall: firewallStats,
    };
  }

  private async getUserStatistics() {
    const [total, administrators, teachers, students] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { role: Role.ADMINISTRATOR },
      }),
      this.prisma.user.count({
        where: { role: Role.TEACHER },
      }),
      this.prisma.user.count({
        where: { role: Role.STUDENT },
      }),
    ]);

    return {
      total,
      administrators,
      teachers,
      students,
    };
  }

  private async getFirewallStatistics() {
    const scheduled = await this.prisma.scheduledRuleChange.count({
      where: {
        executed: false,
      },
    });

    const allRules = await this.firewallService.getAllFirewallRules();
    const enable = allRules.rules.filter((rule) => rule.enabled).length;
    const disable = allRules.rules.length - enable;

    return {
      total: allRules.total,
      enabled: enable,
      disabled: disable,
      scheduled,
    };
  }
}
