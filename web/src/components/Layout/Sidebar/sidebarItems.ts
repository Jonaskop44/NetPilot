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
        path: "/user",
      },
    ],
  },
  {
    title: "Firewall",
    items: [
      {
        name: "Regeln",
        icon: "solar:settings-linear",
        path: "/settings",
      },
      {
        name: "Arbeitstage",
        icon: "solar:suitcase-line-duotone",
        path: "/arbeitstage",
      },
      {
        name: "Urlaubstage",
        icon: "solar:calendar-linear",
        path: "/urlaubstage",
      },
    ],
  },
];
