import { useMemo, useState, useCallback } from "react";
import type { Selection } from "@heroui/react";
import type { UserDto } from "@/api/openapi.schemas";

export const useUserFilters = (users: UserDto[] | undefined) => {
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<Selection>("all");

  const hasSearchFilter = Boolean(filterValue);

  const filteredUsers = useMemo(() => {
    let filteredItems = [...(users || [])];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter(
        (user) =>
          user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (roleFilter !== "all" && roleFilter.size > 0) {
      filteredItems = filteredItems.filter((user) =>
        Array.from(roleFilter).includes(user.role)
      );
    }

    return filteredItems;
  }, [users, filterValue, hasSearchFilter, roleFilter]);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  return {
    filterValue,
    roleFilter,
    filteredUsers,
    setRoleFilter,
    onClear,
    onSearchChange,
  };
};
