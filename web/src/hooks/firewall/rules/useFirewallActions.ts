import { useCallback } from "react";
import {
  useFirewallControllerScheduleRuleChange,
  useFirewallControllerToggleFirewallRule,
} from "@/api/firewall/firewall";

const useFirewallActions = (refetch: () => void) => {
  const toggleMutation = useFirewallControllerToggleFirewallRule();
  const scheduleMutation = useFirewallControllerScheduleRuleChange();

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

  return {
    handleToggleRule,
    handleScheduleRule,
  };
};

export default useFirewallActions;
