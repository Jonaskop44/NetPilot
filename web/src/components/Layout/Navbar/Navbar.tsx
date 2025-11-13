"use client";

import { useSidebar } from "@/context/SidebarProvider";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const { toggleSidebar, toggleMobileSidebar, isExpanded } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 sm:gap-4  lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 lg:flex lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <Icon icon="heroicons-outline:menu-alt-1" />
          </button>

          <Link href="/" className="lg:hidden">
            <Image
              width={154}
              height={32}
              src="./images/logo/logo.svg"
              alt="Logo"
            />
          </Link>

          <div>
            <UserDropdown isMobile={isExpanded} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
