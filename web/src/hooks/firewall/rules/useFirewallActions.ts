import { useCallback } from "react";
import { useFirewallControllerToggleFirewallRule } from "@/api/firewall/firewall";

const useFirewallActions = (refetch: () => void) => {
  const toggleMutation = useFirewallControllerToggleFirewallRule();

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

  return {
    handleToggleRule,
  };
};

export default useFirewallActions;
