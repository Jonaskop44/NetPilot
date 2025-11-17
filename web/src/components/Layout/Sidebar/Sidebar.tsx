"use client";

import { useSidebar } from "@/context/SidebarProvider";
import useAuth from "@/hooks/useAuth";
import useNavigation from "@/hooks/useNavigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const sidebarItems = useNavigation(user?.role);
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const handleSubmenuToggle = (key: string) => {
    setOpenSubmenu((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (openSubmenu && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
      }));
    }
  }, [openSubmenu]);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={150}
              height={40}
            />
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {sidebarItems.map((section, sectionIndex) => (
              <div key={section.title}>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    section.title
                  ) : (
                    <Icon icon="mdi:dots-horizontal" fontSize={24} />
                  )}
                </h2>

                <SidebarItem
                  navItems={section}
                  isExpanded={isExpanded}
                  isHovered={isHovered}
                  isMobileOpen={isMobileOpen}
                  openSubmenu={openSubmenu}
                  subMenuHeight={subMenuHeight}
                  subMenuRefs={subMenuRefs}
                  handleSubmenuToggle={handleSubmenuToggle}
                  isActive={isActive}
                  sectionIndex={sectionIndex}
                />
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
