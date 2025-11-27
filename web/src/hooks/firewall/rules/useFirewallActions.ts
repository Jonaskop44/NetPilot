import { useCallback } from "react";
import {
  useFirewallControllerBulkScheduleRuleChanges,
  useFirewallControllerBulkToggleRules,
  useFirewallControllerScheduleRuleChange,
  useFirewallControllerToggleFirewallRule,
} from "@/api/firewall/firewall";

const useFirewallActions = (refetch: () => void) => {
  const toggleMutation = useFirewallControllerToggleFirewallRule();
  const bulkToggleMutation = useFirewallControllerBulkToggleRules();
  const scheduleMutation = useFirewallControllerScheduleRuleChange();
  const bulkScheduleMutation = useFirewallControllerBulkScheduleRuleChanges();

  const handleToggleRule = useCallback(
    async (uuid: string) => {
      try {
        await toggleMutation.mutateAsync({ params: { uuid } });
        refetch();
      } catch (error) {
        console.error("Failed to toggle rule:", error);
      }
    },
    [toggleMutation, refetch]
  );

  const handleScheduleRule = useCallback(
    async (data: { ruleUuid: string; revertAt: string }) => {
      try {
        await scheduleMutation.mutateAsync({
          data: {
            ruleUuid: data.ruleUuid,
            revertAt: data.revertAt,
          },
        });
        refetch();
      } catch (error) {
        console.error("Failed to schedule rule change:", error);
      }
    },
    [scheduleMutation, refetch]
  );

  const handleBulkToggleRules = useCallback(
    async (uuids: string[]) => {
      try {
        await bulkToggleMutation.mutateAsync({
          data: {
            ruleUuids: uuids,
          },
        });
        refetch();
      } catch (error) {
        console.error("Failed to bulk toggle rules:", error);
      }
    },
    [bulkToggleMutation, refetch]
  );

  const handleBulkScheduleRules = useCallback(
    async (uuids: string[], revertAt: string) => {
      try {
        await bulkScheduleMutation.mutateAsync({
          data: {
            ruleUuids: uuids,
            revertAt: revertAt,
          },
        });
        refetch();
      } catch (error) {
        console.error("Failed to bulk schedule rules:", error);
      }
    },
    [bulkScheduleMutation, refetch]
  );

  return {
    handleToggleRule,
    handleScheduleRule,
    handleBulkToggleRules,
    handleBulkScheduleRules,
  };
};

export default useFirewallActions;
