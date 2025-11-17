import { NavSection } from "@/types/navItem.types";
import { UserDtoRole } from "@/api/openapi.schemas";

export const sidebarItems: NavSection[] = [
  {
    title: "Hauptmenü",
    items: [
      {
        name: "Übersicht",
        icon: "solar:home-angle-linear",
        path: "/dashboard",
      },
      {
        name: "User",
        icon: "solar:user-circle-linear",
        path: "/users",
        allowedRoles: [UserDtoRole.ADMINISTRATOR],
      },
    ],
  },
  {
    title: "Firewall",
    items: [
      {
        name: "Regeln",
        icon: "solar:settings-linear",
        path: "/dashboard/firewall/rules",
        allowedRoles: [UserDtoRole.ADMINISTRATOR, UserDtoRole.TEACHER],
      },
    ],
  },
];
