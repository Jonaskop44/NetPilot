import React, { FC } from "react";
import { Chip, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";
import {
  ACTION_COLOR_MAP,
  ACTION_ICON_MAP,
  ACTION_LABELS,
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
        <>
          {rule.schedule ? (
            <Tooltip
              content={`Geplant bis: ${new Date(rule.schedule.scheduledFor).toLocaleString()}`}
              showArrow
            >
              <Chip
                color="primary"
                variant="flat"
                size="sm"
                startContent={<Icon icon="solar:clock-circle-linear" />}
              >
                {rule.enabled ? "Aktiv" : "Inaktiv"}
              </Chip>
            </Tooltip>
          ) : (
            <Chip
              color={rule.enabled ? "success" : "danger"}
              variant="flat"
              size="sm"
            >
              {rule.enabled ? "Aktiv" : "Inaktiv"}
            </Chip>
          )}
        </>
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
    case "interface":
      return (
        <Chip variant="flat" size="sm">
          {rule.interface || "-"}
        </Chip>
      );
    case "description":
      return (
        <div className="max-w-xs truncate" title={rule.description}>
          {rule.description || "-"}
        </div>
      );
    case "actions":
      return (
        <div className="flex gap-2">
          <Tooltip
            showArrow
            content={rule.enabled ? "Regel deaktivieren" : "Regel aktivieren"}
          >
            <Button
              onPress={() => onToggleRule(rule.uuid)}
              color={rule.enabled ? "danger" : "success"}
              startContent={
                <Icon
                  icon={
                    rule.enabled ? "solar:power-bold" : "solar:power-linear"
                  }
                />
              }
            >
              {rule.enabled ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </Tooltip>
          <Tooltip showArrow content="Regeländerung planen">
            <Button
              color="primary"
              onPress={() => onScheduleRule(rule.uuid)}
              startContent={<Icon icon="solar:calendar-add-linear" />}
            >
              Planen
            </Button>
          </Tooltip>
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
