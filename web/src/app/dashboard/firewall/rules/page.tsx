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
import useFirewallFilters from "@/hooks/firewall/rules/useFirewallFilters";
import useFirewallSorting from "@/hooks/firewall/rules/useFirewallSorting";
import useFirewallActions from "@/hooks/firewall/rules/useFirewallActions";
import useFirewallGrouping from "@/hooks/firewall/rules/useFirewallGrouping";
import FirewallTableTopContent from "@/components/Dashboard/Firewall/Rules/FirewallTableTopContent";
import FirewallTableCell from "@/components/Dashboard/Firewall/Rules/FirewallTableCell";
import FirewallRuleGroup from "@/components/Dashboard/Firewall/Rules/FirewallRuleGroup";
import ScheduleRuleModal from "@/components/Dashboard/Firewall/Rules/ScheduleRuleModal";
import BulkScheduleRuleModal from "@/components/Dashboard/Firewall/Rules/BulkScheduleRuleModal";
import { API_URL } from "@/lib/constants";

const FirewallRulesPage = () => {
  const [selectedRuleUuid, setSelectedRuleUuid] = useState<string>("");
  const [selectedGroupUuids, setSelectedGroupUuids] = useState<string[]>([]);
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBulkOpen,
    onOpen: onBulkOpen,
    onClose: onBulkClose,
  } = useDisclosure();
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
    interfaceFilter,
    categoryFilter,
    availableInterfaces,
    availableCategories,
    filteredRules,
    setActionFilter,
    setInterfaceFilter,
    setCategoryFilter,
    onClear,
    onSearchChange,
  } = useFirewallFilters(data?.rules);

  const { sortDescriptor, setSortDescriptor, sortedRules } =
    useFirewallSorting(filteredRules);

  const { groupedRules, ungroupedRules } = useFirewallGrouping(
    sortedRules,
    interfaceFilter,
    categoryFilter
  );

  const {
    handleToggleRule,
    handleScheduleRule,
    handleBulkToggleRules,
    handleBulkScheduleRules,
  } = useFirewallActions(refetch);

  const handleOpenScheduleModal = (uuid: string) => {
    setSelectedRuleUuid(uuid);
    onOpen();
  };

  const handleOpenBulkScheduleModal = (uuids: string[], groupType: string) => {
    setSelectedGroupUuids(uuids);
    setSelectedGroupType(groupType);
    onBulkOpen();
  };

  const handleScheduleSubmit = (data: {
    ruleUuid: string;
    revertAt: string;
  }) => {
    handleScheduleRule(data);
  };

  const handleBulkScheduleSubmit = (revertAt: string) => {
    handleBulkScheduleRules(selectedGroupUuids, revertAt);
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

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          <FirewallTableTopContent
            filterValue={filterValue}
            actionFilter={actionFilter}
            availableInterfaces={availableInterfaces}
            availableCategories={availableCategories}
            onClear={onClear}
            onSearchChange={onSearchChange}
            onActionFilterChange={setActionFilter}
            onInterfaceFilterChange={setInterfaceFilter}
            onCategoryFilterChange={setCategoryFilter}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner label="Lade Regeln..." />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              {/* Gruppierte Regeln */}
              {groupedRules.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-3">
                    Gruppierte Regeln ({groupedRules.length} Gruppen)
                  </h2>
                  {groupedRules.map((group) => (
                    <FirewallRuleGroup
                      key={group.groupKey}
                      group={group}
                      onToggleGroup={handleBulkToggleRules}
                      onScheduleGroup={(uuids) =>
                        handleOpenBulkScheduleModal(uuids, group.type)
                      }
                      onToggleSingle={handleToggleRule}
                      onScheduleSingle={handleOpenScheduleModal}
                    />
                  ))}
                </div>
              )}

              {/* Ungroupierte Regeln */}
              {ungroupedRules.length > 0 && (
                <div>
                  {groupedRules.length > 0 && (
                    <h2 className="text-xl font-semibold mb-3">
                      Einzelne Regeln ({ungroupedRules.length})
                    </h2>
                  )}
                  <Table
                    aria-label="Firewall Rules Table"
                    isHeaderSticky
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    classNames={{
                      base: "h-full overflow-hidden",
                      wrapper: "max-h-full overflow-auto scrollbar-hide",
                    }}
                  >
                    <TableHeader columns={COLUMNS}>
                      {(column) => (
                        <TableColumn
                          key={column.uid}
                          allowsSorting={column.sortable}
                        >
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody
                      emptyContent={"Keine Regeln gefunden"}
                      items={ungroupedRules}
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
              )}
            </div>
          )}
        </div>
      </div>
      <ScheduleRuleModal
        isOpen={isOpen}
        onClose={onClose}
        onSchedule={handleScheduleSubmit}
        ruleUuid={selectedRuleUuid}
        currentState={!!selectedRule?.enabled}
      />
      <BulkScheduleRuleModal
        isOpen={isBulkOpen}
        onClose={onBulkClose}
        onSchedule={handleBulkScheduleSubmit}
        ruleCount={selectedGroupUuids.length}
        groupType={selectedGroupType}
      />
    </>
  );
};

export default FirewallRulesPage;
