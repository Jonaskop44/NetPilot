import { useMemo, useState, useCallback } from "react";
import type { Selection } from "@heroui/react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";

const useFirewallFilters = (rules: FirewallRuleDto[] | undefined) => {
  const [filterValue, setFilterValue] = useState("");
  const [actionFilter, setActionFilter] = useState<Selection>("all");
  const [directionFilter, setDirectionFilter] = useState<Selection>("all");

  const hasSearchFilter = Boolean(filterValue);

  const filteredRules = useMemo(() => {
    let filteredItems = [...(rules || [])];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter(
        (rule) =>
          rule.description?.toLowerCase().includes(filterValue.toLowerCase()) ||
          rule.source_net?.toLowerCase().includes(filterValue.toLowerCase()) ||
          rule.destination_net
            ?.toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (actionFilter !== "all" && actionFilter.size > 0) {
      filteredItems = filteredItems.filter((rule) =>
        Array.from(actionFilter).includes(rule.action)
      );
    }

    if (directionFilter !== "all" && directionFilter.size > 0) {
      filteredItems = filteredItems.filter((rule) =>
        Array.from(directionFilter).includes(rule.direction)
      );
    }

    return filteredItems;
  }, [rules, filterValue, actionFilter, directionFilter, hasSearchFilter]);

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
    actionFilter,
    directionFilter,
    filteredRules,
    setActionFilter,
    setDirectionFilter,
    onClear,
    onSearchChange,
  };
};

export default useFirewallFilters;
