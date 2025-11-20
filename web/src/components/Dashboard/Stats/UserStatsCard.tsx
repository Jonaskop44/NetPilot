import React, { FC } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { UserStatisticsDto } from "@/api/openapi.schemas";

const ROLE_ICON_MAP: Record<string, string> = {
  ADMINISTRATOR: "eos-icons:admin",
  TEACHER: "fa-solid:chalkboard-teacher",
  STUDENT: "ph:student-bold",
};

interface UserStatsCardProps {
  data: UserStatisticsDto;
}

const UserStatsCard: FC<UserStatsCardProps> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="p-2 rounded-lg bg-primary-100">
          <Icon
            icon="solar:users-group-rounded-bold-duotone"
            width={24}
            className="text-primary"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-md font-semibold">Benutzer Übersicht</p>
          <p className="text-small text-default-500">
            Gesamt: {data.total} Benutzer
          </p>
        </div>
      </CardHeader>
      <CardBody className="gap-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-success-50">
          <div className="flex items-center gap-3">
            <Icon
              icon={ROLE_ICON_MAP.ADMINISTRATOR}
              width={20}
              className="text-success"
            />
            <span className="text-small">Administratoren</span>
          </div>
          <span className="font-semibold text-success">
            {data.administrators}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-primary-50">
          <div className="flex items-center gap-3">
            <Icon
              icon={ROLE_ICON_MAP.TEACHER}
              width={20}
              className="text-primary"
            />
            <span className="text-small">Lehrer</span>
          </div>
          <span className="font-semibold text-primary">{data.teachers}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-warning-50">
          <div className="flex items-center gap-3">
            <Icon
              icon={ROLE_ICON_MAP.STUDENT}
              width={20}
              className="text-warning"
            />
            <span className="text-small">Schüler</span>
          </div>
          <span className="font-semibold text-warning">{data.students}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserStatsCard;
