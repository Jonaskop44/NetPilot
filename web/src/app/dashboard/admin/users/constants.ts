import type { ChipProps } from "@heroui/react";
import { UserDtoRole } from "@/api/openapi.schemas";
import { formatUserRole } from "@/lib/helper";

export const COLUMNS = [
  { name: "ID", uid: "id", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "USERNAME", uid: "username" },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const ROLE_COLOR_MAP: Record<string, ChipProps["color"]> = {
  ADMINISTRATOR: "success",
  TEACHER: "primary",
  STUDENT: "warning",
};

export const ROLE_ICON_MAP: Record<string, string> = {
  ADMINISTRATOR: "eos-icons:admin",
  TEACHER: "fa7-solid:chalkboard-teacher",
  STUDENT: "ph:student-bold",
};

export const EDIT_ACTIONS = [
  {
    key: "administrator",
    role: UserDtoRole.ADMINISTRATOR,
    name: `Als ${formatUserRole(UserDtoRole.ADMINISTRATOR)} setzen`,
    icon: ROLE_ICON_MAP.ADMINISTRATOR,
  },
  {
    key: "teacher",
    role: UserDtoRole.TEACHER,
    name: `Als ${formatUserRole(UserDtoRole.TEACHER)} setzen`,
    icon: ROLE_ICON_MAP.TEACHER,
  },
  {
    key: "student",
    role: UserDtoRole.STUDENT,
    name: `Als ${formatUserRole(UserDtoRole.STUDENT)} setzen`,
    icon: ROLE_ICON_MAP.STUDENT,
  },
];
