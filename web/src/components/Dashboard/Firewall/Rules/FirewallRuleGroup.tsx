import React, { FC, useState } from "react";
import { Chip, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { RuleGroup } from "@/hooks/firewall/rules/useFirewallGrouping";

interface FirewallRuleGroupProps {
  group: RuleGroup;
  onToggleGroup: (uuids: string[]) => void;
  onScheduleGroup: (uuids: string[]) => void;
  onToggleSingle: (uuid: string) => void;
  onScheduleSingle: (uuid: string) => void;
}

const FirewallRuleGroup: FC<FirewallRuleGroupProps> = ({
  group,
  onToggleGroup,
  onScheduleGroup,
  onToggleSingle,
  onScheduleSingle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const allEnabled = group.rules.every((rule) => rule.enabled);
  const allDisabled = group.rules.every((rule) => !rule.enabled);
  const someEnabled = !allEnabled && !allDisabled;

  const ruleUuids = group.rules.map((r) => r.uuid);

  return (
    <div className="border border-divider rounded-lg p-4 mb-2">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Icon
              icon={
                isExpanded
                  ? "solar:alt-arrow-down-linear"
                  : "solar:alt-arrow-right-linear"
              }
            />
          </Button>

          <Chip variant="flat" size="sm" color="secondary">
            {group.type.toUpperCase()}
          </Chip>

          <Chip variant="flat" size="sm">
            {group.interface}
          </Chip>

          <div className="flex gap-1 flex-wrap">
            {group.categories.map((category, index) => (
              <Chip key={index} variant="flat" size="sm" color="primary">
                {category}
              </Chip>
            ))}
          </div>

          <Chip variant="flat" size="sm">
            {group.rules.length} Regeln
          </Chip>

          {someEnabled && (
            <Chip variant="flat" size="sm" color="warning">
              Gemischt
            </Chip>
          )}
        </div>

        <div className="flex gap-2">
          <Tooltip
            showArrow
            content={
              allEnabled ? "Alle Regeln deaktivieren" : "Alle Regeln aktivieren"
            }
          >
            <Button
              onPress={() => onToggleGroup(ruleUuids)}
              color={allEnabled ? "danger" : "success"}
              size="sm"
              startContent={
                <Icon
                  icon={allEnabled ? "solar:power-bold" : "solar:power-linear"}
                />
              }
            >
              {allEnabled ? "Alle Deaktivieren" : "Alle Aktivieren"}
            </Button>
          </Tooltip>

          <Tooltip showArrow content="Alle Regeln planen">
            <Button
              color="primary"
              size="sm"
              onPress={() => onScheduleGroup(ruleUuids)}
              startContent={<Icon icon="solar:calendar-add-linear" />}
            >
              Alle Planen
            </Button>
          </Tooltip>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-8 mt-3 space-y-2">
          {group.rules.map((rule) => (
            <div
              key={rule.uuid}
              className="flex justify-between items-center p-3 bg-default-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
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

                <div className="max-w-md truncate" title={rule.description}>
                  {rule.description || "-"}
                </div>
              </div>

              <div className="flex gap-2">
                <Tooltip
                  showArrow
                  content={
                    rule.enabled ? "Regel deaktivieren" : "Regel aktivieren"
                  }
                >
                  <Button
                    onPress={() => onToggleSingle(rule.uuid)}
                    color={rule.enabled ? "danger" : "success"}
                    size="sm"
                    variant="flat"
                    startContent={
                      <Icon
                        icon={
                          rule.enabled
                            ? "solar:power-bold"
                            : "solar:power-linear"
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
                    size="sm"
                    variant="flat"
                    onPress={() => onScheduleSingle(rule.uuid)}
                    startContent={<Icon icon="solar:calendar-add-linear" />}
                  >
                    Planen
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FirewallRuleGroup;
