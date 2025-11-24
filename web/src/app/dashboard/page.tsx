"use client";

import useAuth from "@/hooks/useAuth";
import { Spinner, Button, Card, CardBody } from "@heroui/react";
import StatCard from "@/components/Dashboard/Stats/StatCard";
import FirewallStatsCard from "@/components/Dashboard/Stats/FirewallStatsCard";
import SessionsChartCard from "@/components/Dashboard/Stats/SessionsChartCard";
import { useAnalyticsControllerGetStatistics } from "@/api/analytics/analytics";
import TableError from "@/components/Common/TableError";
import { ROLE_COLOR_MAP, ROLE_ICON_MAP } from "./admin/users/constants";
import { UserDtoRole } from "@/api/openapi.schemas";
import { Icon } from "@iconify/react";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { data, isLoading, error } = useAnalyticsControllerGetStatistics({
    query: {
      enabled: user?.role !== UserDtoRole.STUDENT,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner label="Lade Dashboard..." />
      </div>
    );
  }

  // Wenn der Benutzer ein Student ist, zeige Zugriffsverweigerung
  if (user?.role === UserDtoRole.STUDENT) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="max-w-md">
          <CardBody className="flex flex-col items-center gap-4 p-8">
            <Icon
              icon="solar:shield-warning-bold-duotone"
              className="text-warning"
              width={80}
            />
            <h2 className="text-2xl font-bold text-center">Kein Zugriff</h2>
            <p className="text-center text-default-500">
              Sie haben als Schüler keinen Zugriff auf das Dashboard. Bitte
              melden Sie sich ab oder kontaktieren Sie einen Administrator.
            </p>
            <Button
              color="primary"
              startContent={
                <Icon icon="solar:logout-2-bold-duotone" width={20} />
              }
              onPress={logout}
            >
              Abmelden
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return <TableError />;
  }

  return (
    <div className="flex flex-col h-full p-6 gap-6 overflow-auto">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-default-500">Willkommen zurück, {user?.username}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gesamt Benutzer"
          value={data.users.total}
          icon="solar:users-group-rounded-bold-duotone"
          iconColor="primary"
        />
        <StatCard
          title="Administratoren"
          value={data.users.administrators}
          icon={ROLE_ICON_MAP.ADMINISTRATOR}
          iconColor={ROLE_COLOR_MAP.ADMINISTRATOR}
        />
        <StatCard
          title="Lehrer"
          value={data.users.teachers}
          icon={ROLE_ICON_MAP.TEACHER}
          iconColor={ROLE_COLOR_MAP.TEACHER}
        />
        <StatCard
          title="Schüler"
          value={data.users.students}
          icon={ROLE_ICON_MAP.STUDENT}
          iconColor={ROLE_COLOR_MAP.STUDENT}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsChartCard data={data.sessions} />
        <FirewallStatsCard data={data.firewall} />
      </div>
    </div>
  );
};

export default DashboardPage;
