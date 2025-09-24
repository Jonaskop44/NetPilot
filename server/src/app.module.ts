import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirewallModule } from './firewall/firewall.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), FirewallModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
