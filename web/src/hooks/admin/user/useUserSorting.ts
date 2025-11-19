import { useMemo, useState } from "react";
import type { SortDescriptor } from "@heroui/react";
import type { UserDto } from "@/api/openapi.schemas";

const useUserSorting = (users: UserDto[]) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof UserDto];
      const second = b[sortDescriptor.column as keyof UserDto];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [users, sortDescriptor]);

  return {
    sortDescriptor,
    setSortDescriptor,
    sortedUsers,
  };
};

export default useUserSorting;
