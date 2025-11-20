import React, { FC } from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor?: string;
  description?: string;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor = "primary",
  description,
}) => {
  return (
    <Card className="w-full">
      <CardBody className="gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-small text-default-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-tiny text-default-400">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-default-100 text-${iconColor}`}>
            <Icon icon={icon} width={24} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
