import { UserDtoRole } from "@/api/openapi.schemas";

export const formatUserRole = (role: UserDtoRole) => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};
