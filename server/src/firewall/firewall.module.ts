import { Module } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { FirewallController } from './firewall.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [FirewallController],
  providers: [FirewallService],
})
export class FirewallModule {}
