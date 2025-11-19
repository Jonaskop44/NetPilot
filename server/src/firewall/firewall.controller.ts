import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  FirewallRulesResponseDto,
  ScheduleRuleChangeDto,
  ScheduledRuleChangeResponseDto,
} from './dto/firewall-rule.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RolesGuard } from 'src/guard/roles.guard';

@Roles(Role.TEACHER, Role.ADMINISTRATOR)
@UseGuards(RolesGuard)
@ApiTags('firewall')
@Controller('firewall')
export class FirewallController {
  constructor(private readonly firewallService: FirewallService) {}

  @Get('rules')
  @ApiOperation({
    summary: 'Get all firewall rules',
    description:
      'Retrieves all firewall rules from OPNsense with optional interface filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved firewall rules',
    type: FirewallRulesResponseDto,
  })
  async getAllFirewallRules() {
    return this.firewallService.getAllFirewallRules();
  }

  @Post('toggle-rule')
  @ApiOperation({
    summary: 'Toggle a firewall rule',
    description: 'Enables or disables a firewall rule by its UUID',
  })
  @ApiQuery({
    name: 'uuid',
    description: 'Unique identifier of the firewall rule to toggle',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully toggled the firewall rule',
  })
  async toggleFirewallRule(@Query('uuid') uuid: string) {
    return this.firewallService.toggleFirewallRule(uuid);
  }

  @Post('schedule-rule-change')
  @ApiOperation({
    summary: 'Toggle a firewall rule temporarily',
    description:
      'Immediately enables or disables a firewall rule, and automatically reverts it at the specified time',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully toggled the rule and scheduled revert',
    type: ScheduledRuleChangeResponseDto,
  })
  async scheduleRuleChange(
    @Body() dto: ScheduleRuleChangeDto,
    @Request() request,
  ) {
    return this.firewallService.scheduleRuleChange(dto, request);
  }
}
