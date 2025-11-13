import SidebarProvider from "@/context/SidebarProvider";
import { DashboardContent } from "@/components/Layout/DashboardContent";
import { FC } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;
