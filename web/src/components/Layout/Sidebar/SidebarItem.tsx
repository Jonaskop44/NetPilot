import Link from "next/link";
import { Icon } from "@iconify/react";
import React, { RefObject } from "react";
import { NavSection } from "@/types/navItem.types";

interface SidebarItemProps {
  navItems: NavSection;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  openSubmenu: string | null;
  subMenuHeight: Record<string, number>;
  subMenuRefs: RefObject<Record<string, HTMLDivElement | null>>;
  handleSubmenuToggle: (key: string) => void;
  isActive: (path: string) => boolean;
  sectionIndex: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  navItems,
  isExpanded,
  isHovered,
  isMobileOpen,
  openSubmenu,
  subMenuHeight,
  subMenuRefs,
  handleSubmenuToggle,
  isActive,
  sectionIndex,
}) => {
  return (
    <ul className="flex flex-col gap-4">
      {navItems.items.map((nav, itemIndex) => {
        const key = `${sectionIndex}-${itemIndex}`;
        const isOpen = openSubmenu === key;

        return (
          <li key={key}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(key)}
                className={`menu-item group  ${
                  isOpen ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  <Icon icon={nav.icon} fontSize={24} />
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <Icon
                    icon="mdi:chevron-down"
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                      isOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    <Icon icon={nav.icon} fontSize={24} />
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  if (subMenuRefs.current) subMenuRefs.current[key] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[key]}px` : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarItem;
