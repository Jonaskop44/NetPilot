import { useMemo } from "react";
import type { FirewallRuleDto } from "@/api/openapi.schemas";
import type { Selection } from "@heroui/react";

export interface RuleGroup {
  type: string;
  interface: string;
  categories: string[];
  rules: FirewallRuleDto[];
  groupKey: string;
}

const useFirewallGrouping = (
  rules: FirewallRuleDto[],
  interfaceFilter: Selection,
  categoryFilter: Selection
) => {
  const { groupedRules, ungroupedRules } = useMemo(() => {
    const shouldGroup =
      interfaceFilter !== "all" &&
      interfaceFilter.size > 0 &&
      categoryFilter !== "all" &&
      categoryFilter.size > 0;

    if (!shouldGroup) {
      return { groupedRules: [], ungroupedRules: rules };
    }

    const groups = new Map<string, RuleGroup>();
    const ungrouped: FirewallRuleDto[] = [];

    rules.forEach((rule) => {
      // Extract type from description (case-insensitive)
      const typeMatch = rule.description?.match(/^\[([^\]]+)\]/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : null;

      // Rule must have type, interface, and at least one category
      if (
        !type ||
        !rule.interface ||
        !rule.categories ||
        rule.categories.length === 0
      ) {
        ungrouped.push(rule);
        return;
      }

      //Create group key
      const sortedCategories = [...rule.categories].sort();
      const groupKey = `${type}|${rule.interface}|${sortedCategories.join(",")}`;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          type,
          interface: rule.interface,
          categories: sortedCategories,
          rules: [],
          groupKey,
        });
      }

      groups.get(groupKey)!.rules.push(rule);
    });

    // Keep only groups with 2 or more rules
    const finalGroups: RuleGroup[] = [];
    groups.forEach((group) => {
      if (group.rules.length >= 2) {
        finalGroups.push(group);
      } else {
        // Add single rules to ungrouped
        ungrouped.push(...group.rules);
      }
    });

    return {
      groupedRules: finalGroups,
      ungroupedRules: ungrouped,
    };
  }, [rules, interfaceFilter, categoryFilter]);

  return { groupedRules, ungroupedRules };
};

export default useFirewallGrouping;
