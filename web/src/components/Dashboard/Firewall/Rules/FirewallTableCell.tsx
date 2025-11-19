import React, { FC } from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";
import {
  ACTION_COLOR_MAP,
  ACTION_ICON_MAP,
  ACTION_LABELS,
  IP_PROTOCOL_LABELS,
  DIRECTION_ICON_MAP,
  DIRECTION_LABELS,
} from "../../../../app/dashboard/firewall/rules/constants";

interface FirewallTableCellProps {
  rule: FirewallRuleDto;
  columnKey: React.Key;
  onToggleRule: (uuid: string) => void;
  onScheduleRule: (uuid: string) => void;
}

const FirewallTableCell: FC<FirewallTableCellProps> = ({
  rule,
  columnKey,
  onToggleRule,
  onScheduleRule,
}) => {
  const cellValue = rule[columnKey as keyof FirewallRuleDto];

  switch (columnKey) {
    case "enabled":
      return (
        <Chip
          color={rule.enabled ? "success" : "danger"}
          variant="flat"
          size="sm"
        >
          {rule.enabled ? "Aktiv" : "Inaktiv"}
        </Chip>
      );
    case "action":
      return (
        <Chip
          color={ACTION_COLOR_MAP[rule.action]}
          variant="flat"
          size="sm"
          startContent={
            <Icon
              icon={
                ACTION_ICON_MAP[rule.action] || "solar:question-circle-linear"
              }
            />
          }
        >
          {ACTION_LABELS[rule.action] || rule.action}
        </Chip>
      );
    case "direction":
      return (
        <div className="flex items-center gap-2">
          <Icon icon={DIRECTION_ICON_MAP[rule.direction]} />
          {DIRECTION_LABELS[rule.direction]}
        </div>
      );
    case "interface":
      return (
        <Chip variant="flat" size="sm">
          {rule.interface || "-"}
        </Chip>
      );
    case "ipprotocol":
      return (
        <Chip variant="flat" size="sm" color="primary">
          {IP_PROTOCOL_LABELS[rule.ipprotocol] || rule.ipprotocol || "-"}
        </Chip>
      );
    case "protocol":
      return rule.protocol || "-";
    case "log":
      return (
        <Chip color={rule.log ? "success" : "default"} variant="dot" size="sm">
          {rule.log ? "Aktiv" : "Inaktiv"}
        </Chip>
      );
    case "source":
      return (
        <div className="text-sm">
          <div>{rule.source_net || "any"}</div>
          {rule.source_port && (
            <div className="text-gray-500 text-xs">
              Port: {rule.source_port}
            </div>
          )}
        </div>
      );
    case "destination":
      return (
        <div className="text-sm">
          <div>{rule.destination_net || "any"}</div>
          {rule.destination_port && (
            <div className="text-gray-500 text-xs">
              Port: {rule.destination_port}
            </div>
          )}
        </div>
      );
    case "description":
      return (
        <div className="max-w-xs truncate" title={rule.description}>
          {rule.description || "-"}
        </div>
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <Icon
                  icon="solar:menu-dots-bold"
                  className="text-default-400"
                  width={20}
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Rule Actions">
              <DropdownItem
                key="toggle"
                startContent={
                  <Icon
                    icon={
                      rule.enabled ? "solar:power-linear" : "solar:power-bold"
                    }
                  />
                }
                onPress={() => onToggleRule(rule.uuid)}
                color={rule.enabled ? "danger" : "success"}
              >
                {rule.enabled ? "Deaktivieren" : "Aktivieren"}
              </DropdownItem>
              <DropdownItem
                key="schedule"
                startContent={<Icon icon="solar:calendar-add-linear" />}
                onPress={() => onScheduleRule(rule.uuid)}
              >
                Regeländerung planen
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      if (cellValue == null) return "-";
      if (typeof cellValue === "object") {
        try {
          return (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(cellValue)}
            </pre>
          );
        } catch {
          return String(cellValue);
        }
      }
      return String(cellValue);
  }
};

export default FirewallTableCell;
