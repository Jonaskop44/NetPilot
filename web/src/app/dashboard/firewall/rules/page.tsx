"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useFirewallControllerGetAllFirewallRules } from "@/api/firewall/firewall";
import TableError from "@/components/Common/TableError";
import { COLUMNS } from "./constants";
import useFirewallFilters from "../../../../hooks/firewall/rules/useFirewallFilters";
import useFirewallSorting from "../../../../hooks/firewall/rules/useFirewallSorting";
import useFirewallActions from "../../../../hooks/firewall/rules/useFirewallActions";
import FirewallTableTopContent from "../../../../components/Dashboard/Firewall/Rules/FirewallTableTopContent";
import FirewallTableCell from "../../../../components/Dashboard/Firewall/Rules/FirewallTableCell";
import ScheduleRuleModal from "../../../../components/Dashboard/Firewall/Rules/ScheduleRuleModal";
import { API_URL } from "@/lib/constants";

const FirewallRulesPage = () => {
  const [selectedRuleUuid, setSelectedRuleUuid] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, error, refetch } =
    useFirewallControllerGetAllFirewallRules();

  // Subscribe to real-time rule change events
  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/v1/firewall/events`, {
      withCredentials: true,
    });

    eventSource.onmessage = () => {
      refetch();
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [refetch]);

  const {
    filterValue,
    actionFilter,
    directionFilter,
    filteredRules,
    setActionFilter,
    setDirectionFilter,
    onClear,
    onSearchChange,
  } = useFirewallFilters(data?.rules);

  const { sortDescriptor, setSortDescriptor, sortedRules } =
    useFirewallSorting(filteredRules);

  const { handleToggleRule, handleScheduleRule } = useFirewallActions(refetch);

  const handleOpenScheduleModal = (uuid: string) => {
    setSelectedRuleUuid(uuid);
    onOpen();
  };

  const handleScheduleSubmit = (data: {
    ruleUuid: string;
    revertAt: string;
  }) => {
    handleScheduleRule(data);
  };

  const selectedRule = sortedRules.find((r) => r.uuid === selectedRuleUuid);

  if (error) {
    return <TableError />;
  }

  return (
    <>
      <div className="flex flex-col h-full p-6 overflow-hidden">
        <div className="shrink-0 mb-4">
          <h1 className="text-3xl font-bold mb-2">Firewall Regeln</h1>
        </div>

        <div className="flex-1 min-h-0">
          <Table
            aria-label="Firewall Rules Table"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            topContent={
              <FirewallTableTopContent
                filterValue={filterValue}
                actionFilter={actionFilter}
                directionFilter={directionFilter}
                onClear={onClear}
                onSearchChange={onSearchChange}
                onActionFilterChange={setActionFilter}
                onDirectionFilterChange={setDirectionFilter}
                onAddRule={() => {}}
              />
            }
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
            classNames={{
              base: "h-full overflow-hidden",
              wrapper: "max-h-full overflow-auto scrollbar-hide",
            }}
          >
            <TableHeader columns={COLUMNS}>
              {(column) => (
                <TableColumn key={column.uid} allowsSorting={column.sortable}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Keine Regeln gefunden"}
              items={sortedRules}
              isLoading={isLoading}
              loadingContent={<Spinner label="Lade Regeln..." />}
            >
              {(item) => (
                <TableRow key={item.uuid}>
                  {(columnKey) => (
                    <TableCell>
                      <FirewallTableCell
                        rule={item}
                        columnKey={columnKey}
                        onToggleRule={handleToggleRule}
                        onScheduleRule={() =>
                          handleOpenScheduleModal(item.uuid)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ScheduleRuleModal
        isOpen={isOpen}
        onClose={onClose}
        onSchedule={handleScheduleSubmit}
        ruleUuid={selectedRuleUuid}
        currentState={!!selectedRule?.enabled}
      />
    </>
  );
};

export default FirewallRulesPage;
