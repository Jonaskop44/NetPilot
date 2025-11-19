import { useMemo, useState } from "react";
import type { SortDescriptor } from "@heroui/react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";

const useFirewallSorting = (rules: FirewallRuleDto[]) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "action",
    direction: "ascending",
  });

  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof FirewallRuleDto];
      const second = b[sortDescriptor.column as keyof FirewallRuleDto];

      const aVal = first === undefined || first === null ? "" : String(first);
      const bVal =
        second === undefined || second === null ? "" : String(second);

      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [rules, sortDescriptor]);

  return {
    sortDescriptor,
    setSortDescriptor,
    sortedRules,
  };
};

export default useFirewallSorting;
