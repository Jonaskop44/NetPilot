"use client";

import useAuth from "@/hooks/useAuth";
import { Spinner } from "@heroui/react";
import StatCard from "@/components/Dashboard/Stats/StatCard";
import UserStatsCard from "@/components/Dashboard/Stats/UserStatsCard";
import FirewallStatsCard from "@/components/Dashboard/Stats/FirewallStatsCard";
import { useAnalyticsControllerGetStatistics } from "@/api/analytics/analytics";

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
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-danger">Fehler beim Laden der Dashboard-Daten</p>
      </div>
    );
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
          iconColor="text-primary"
        />
        <StatCard
          title="Administratoren"
          value={data.users.administrators}
          icon="solar:crown-line-duotone"
          iconColor="text-success"
        />
        <StatCard
          title="Lehrer"
          value={data.users.teachers}
          icon="solar:meditation-bold"
          iconColor="text-primary"
        />
        <StatCard
          title="Schüler"
          value={data.users.students}
          icon="solar:face-scan-circle-linear"
          iconColor="text-warning"
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
