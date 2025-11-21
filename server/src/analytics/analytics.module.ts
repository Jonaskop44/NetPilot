import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { FirewallModule } from 'src/firewall/firewall.module';

@Module({
  imports: [UserModule, FirewallModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
