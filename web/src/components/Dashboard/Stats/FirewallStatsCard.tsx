import React, { FC } from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { FirewallStatisticsDto } from "@/api/openapi.schemas";

interface FirewallStatsCardProps {
  data: FirewallStatisticsDto;
}

const FirewallStatsCard: FC<FirewallStatsCardProps> = ({ data }) => {
  const enabledPercentage =
    data.total > 0 ? Math.round((data.enabled / data.total) * 100) : 0;

  const disabledPercentage = 100 - enabledPercentage;

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="p-2 rounded-lg bg-danger-100">
          <Icon
            icon="solar:shield-network-bold-duotone"
            width={24}
            className="text-danger"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-md font-semibold">Firewall Übersicht</p>
          <p className="text-small text-default-500">
            Gesamt: {data.total} Regeln
          </p>
        </div>
      </CardHeader>
      <CardBody className="gap-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-success-50">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:check-circle-bold"
              width={20}
              className="text-success"
            />
            <span className="text-small">Aktiviert</span>
          </div>
          <div className="flex items-center gap-2">
            <Chip size="sm" color="success" variant="flat">
              {enabledPercentage}%
            </Chip>
            <span className="font-semibold text-success">{data.enabled}</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-default-100">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:close-circle-bold"
              width={20}
              className="text-default-500"
            />
            <span className="text-small">Deaktiviert</span>
          </div>
          <div className="flex items-center gap-2">
            <Chip size="sm" color="default" variant="flat">
              {disabledPercentage}%
            </Chip>
            <span className="font-semibold text-default-600">
              {data.disabled}
            </span>
          </div>
        </div>
        {data.scheduled > 0 && (
          <div className="flex justify-between items-center p-3 rounded-lg bg-sky-50">
            <div className="flex items-center gap-3">
              <Icon
                icon="solar:clock-circle-bold"
                width={20}
                className="text-sky-600"
              />
              <span className="text-small">Geplante Änderungen</span>
            </div>
            <span className="font-semibold text-sky-600">{data.scheduled}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default FirewallStatsCard;
