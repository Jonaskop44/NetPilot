import { useMemo, useState, useCallback } from "react";
import type { Selection } from "@heroui/react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";

const useFirewallFilters = (rules: FirewallRuleDto[] | undefined) => {
  const [filterValue, setFilterValue] = useState("");
  const [actionFilter, setActionFilter] = useState<Selection>("all");
  const [interfaceFilter, setInterfaceFilter] = useState<Selection>("all");

  const hasSearchFilter = Boolean(filterValue);

  // Extract unique interfaces from rules
  const availableInterfaces = useMemo(() => {
    if (!rules) return [];
    const interfaces = new Set<string>();
    rules.forEach((rule) => {
      if (rule.interface) {
        interfaces.add(rule.interface);
      }
    });
    return Array.from(interfaces).sort();
  }, [rules]);

  const filteredRules = useMemo(() => {
    let filteredItems = [...(rules || [])];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((rule) =>
        rule.description?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (actionFilter !== "all" && actionFilter.size > 0) {
      filteredItems = filteredItems.filter((rule) =>
        Array.from(actionFilter).includes(rule.action)
      );
    }

    if (interfaceFilter !== "all" && interfaceFilter.size > 0) {
      filteredItems = filteredItems.filter(
        (rule) =>
          rule.interface && Array.from(interfaceFilter).includes(rule.interface)
      );
    }

    return filteredItems;
  }, [rules, filterValue, actionFilter, interfaceFilter, hasSearchFilter]);

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
    interfaceFilter,
    availableInterfaces,
    filteredRules,
    setActionFilter,
    setInterfaceFilter,
    onClear,
    onSearchChange,
  };
};

export default useFirewallFilters;
