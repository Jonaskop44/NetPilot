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
    const [userStats, firewallStats, sessions] = await Promise.all([
      this.getUserStatistics(),
      this.getFirewallStatistics(),
      this.getAllActiveSessions(),
    ]);

    return {
      users: userStats,
      firewall: firewallStats,
      sessions: sessions,
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

  private async getAllActiveSessions() {
    const now = new Date();
    const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Stunden
    const START_HOUR = 8;
    const END_HOUR = 24;

    // Definiere Zeitfenster für heute (8:00 - 23:59)
    const todayStart = new Date(now);
    todayStart.setHours(START_HOUR, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Berechne entsprechende Expire-Zeitpunkte (createdAt + 24h = expire)
    const expireStart = new Date(todayStart.getTime() + SESSION_DURATION_MS);
    const expireEnd = new Date(todayEnd.getTime() + SESSION_DURATION_MS);

    // Hole relevante Sessions
    const sessions = await this.prisma.session.findMany({
      where: {
        expire: {
          gte: expireStart,
          lte: expireEnd,
        },
      },
    });

    // Initialisiere Stundenzähler (8-23 Uhr)
    const hourlyCount = new Map<number, number>();
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      hourlyCount.set(hour, 0);
    }

    // Zähle Sessions pro Stunde
    sessions.forEach((session) => {
      const createdAt = new Date(
        new Date(session.expire).getTime() - SESSION_DURATION_MS,
      );

      if (createdAt >= todayStart && createdAt <= todayEnd) {
        const hour = createdAt.getHours();
        if (hour >= START_HOUR) {
          hourlyCount.set(hour, (hourlyCount.get(hour) || 0) + 1);
        }
      }
    });

    // Formatiere Ergebnis
    return Array.from(hourlyCount.entries())
      .map(([hour, count]) => {
        const timestamp = new Date(todayStart);
        timestamp.setHours(hour, 0, 0, 0);
        return {
          time: timestamp.toISOString(),
          count,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }
}
