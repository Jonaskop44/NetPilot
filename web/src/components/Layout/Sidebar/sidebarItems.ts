import { NavSection } from "@/types/navItem.types";

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
      },
    ],
  },
  {
    title: "Firewall",
    items: [
      {
        name: "Regeln",
        icon: "solar:settings-linear",
        path: "/firewall/rules",
      },
    ],
  },
];
