import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Request,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  FirewallRulesResponseDto,
  ScheduleRuleChangeDto,
  ScheduledRuleChangeResponseDto,
  BulkToggleRulesDto,
  BulkScheduleRulesDto,
} from './dto/firewall-rule.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RolesGuard } from 'src/guard/roles.guard';
import { Observable } from 'rxjs';

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

  @Post('bulk-toggle')
  @ApiOperation({
    summary: 'Toggle multiple firewall rules',
    description: 'Enables or disables multiple firewall rules by their UUIDs',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully toggled firewall rules',
  })
  async bulkToggleRules(@Body() dto: BulkToggleRulesDto) {
    return this.firewallService.bulkToggleRules(dto.ruleUuids);
  }

  @Post('bulk-schedule')
  @ApiOperation({
    summary: 'Schedule multiple firewall rules to change',
    description:
      'Immediately toggles multiple firewall rules and schedules them to revert at a specific time',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully scheduled multiple rules',
  })
  async bulkScheduleRuleChanges(
    @Body() dto: BulkScheduleRulesDto,
    @Request() request,
  ) {
    return this.firewallService.bulkScheduleRuleChanges(dto, request);
  }

  @Sse('events')
  @ApiOperation({
    summary: 'Subscribe to firewall rule change events',
    description: 'Server-Sent Events stream for real-time rule updates',
  })
  ruleEvents(): Observable<MessageEvent> {
    return this.firewallService.getRuleChangeEvents();
  }
}
