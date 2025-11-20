"use client";

import useAuth from "@/hooks/useAuth";
import { Spinner } from "@heroui/react";
import StatCard from "@/components/Dashboard/Stats/StatCard";
import UserStatsCard from "@/components/Dashboard/Stats/UserStatsCard";
import FirewallStatsCard from "@/components/Dashboard/Stats/FirewallStatsCard";
import { useAnalyticsControllerGetStatistics } from "@/api/analytics/analytics";
import TableError from "@/components/Common/TableError";
import { ROLE_COLOR_MAP, ROLE_ICON_MAP } from "./admin/users/constants";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useAnalyticsControllerGetStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner label="Lade Dashboard..." />
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
        <UserStatsCard data={data.users} />
        <FirewallStatsCard data={data.firewall} />
      </div>
    </div>
  );
};

export default DashboardPage;
