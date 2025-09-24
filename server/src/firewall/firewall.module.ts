import { Module } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { FirewallController } from './firewall.controller';

@Module({
  controllers: [FirewallController],
  providers: [FirewallService],
})
export class FirewallModule {}
