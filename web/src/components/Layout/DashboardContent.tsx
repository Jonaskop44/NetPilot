"use client";

import { useSidebar } from "@/context/SidebarProvider";
import Navbar from "@/components/Layout/Navbar/Navbar";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import { FC, ReactNode } from "react";

interface DashboardContentProps {
  children: ReactNode;
}

export const DashboardContent: FC<DashboardContentProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentMargin} overflow-hidden`}
      >
        <Navbar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
