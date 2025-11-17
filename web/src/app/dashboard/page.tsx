"use client";

import useAuth from "@/hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{user?.role}</h1>
    </div>
  );
};

export default DashboardPage;
