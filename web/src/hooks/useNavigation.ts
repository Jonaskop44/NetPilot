"use client";

import { useMemo } from "react";
import { UserDtoRole } from "@/api/openapi.schemas";
import { sidebarItems } from "@/components/Layout/Sidebar/sidebarItems";

const useNavigation = (userRole?: UserDtoRole) => {
  return useMemo(() => {
    if (!userRole) {
      return [];
    }

    return sidebarItems
      .filter((section) => {
        if (section.allowedRoles && section.allowedRoles.length > 0) {
          return section.allowedRoles.includes(userRole);
        }
        return true;
      })
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => {
            if (item.allowedRoles && item.allowedRoles.length > 0) {
              return item.allowedRoles.includes(userRole);
            }
            return true;
          })
          .map((item) => {
            if (item.subItems) {
              return {
                ...item,
                subItems: item.subItems.filter((subItem) => {
                  if (subItem.allowedRoles && subItem.allowedRoles.length > 0) {
                    return subItem.allowedRoles.includes(userRole);
                  }
                  return true;
                }),
              };
            }
            return item;
          })
          .filter((item) => {
            if (item.subItems) {
              return item.subItems.length > 0;
            }
            return true;
          }),
      }))
      .filter((section) => section.items.length > 0);
  }, [userRole]);
};

export default useNavigation;
