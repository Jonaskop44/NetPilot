import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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

    // Note: Firewall rules are from OPNsense API, not database
    // For now, we return 0 for total/enabled/disabled
    // These will be calculated when firewall data is available
    return {
      total: 0,
      enabled: 0,
      disabled: 0,
      scheduled,
    };
  }
}
