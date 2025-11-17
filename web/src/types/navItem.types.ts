import { UserDtoRole } from "@/api/openapi.schemas";

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    allowedRoles?: UserDtoRole[];
  }[];
  allowedRoles?: UserDtoRole[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
  allowedRoles?: UserDtoRole[];
};
