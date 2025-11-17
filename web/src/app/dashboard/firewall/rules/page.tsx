"use client";

import { useFirewallControllerGetAllFirewallRules } from "@/api/firewall/firewall";
import type { FirewallRuleDto } from "@/api/openapi.schemas";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
  ChipProps,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useMemo, useCallback } from "react";

const columns = [
  { name: "STATUS", uid: "enabled", sortable: true },
  { name: "AKTION", uid: "action", sortable: true },
  { name: "RICHTUNG", uid: "direction", sortable: true },
  { name: "INTERFACE", uid: "interface" },
  { name: "IP-PROTOKOLL", uid: "ipprotocol" },
  { name: "PROTOKOLL", uid: "protocol" },
  { name: "QUELLE", uid: "source" },
  { name: "ZIEL", uid: "destination" },
  { name: "LOG", uid: "log" },
  { name: "BESCHREIBUNG", uid: "description" },
];

const actionColorMap: Record<string, ChipProps["color"]> = {
  pass: "success",
  block: "danger",
  reject: "danger",
};

const FirewallRulesPage = () => {
  const [filterValue, setFilterValue] = useState("");
  const [actionFilter, setActionFilter] = useState<Selection>("all");
  const [directionFilter, setDirectionFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "action",
    direction: "ascending",
  });

  const { data, isLoading, error } = useFirewallControllerGetAllFirewallRules();

  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredRules = [...(data?.rules || [])];

    if (hasSearchFilter) {
      filteredRules = filteredRules.filter(
        (rule) =>
          rule.description?.toLowerCase().includes(filterValue.toLowerCase()) ||
          rule.source_net?.toLowerCase().includes(filterValue.toLowerCase()) ||
          rule.destination_net
            ?.toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (actionFilter !== "all" && actionFilter.size > 0) {
      filteredRules = filteredRules.filter((rule) =>
        Array.from(actionFilter).includes(rule.action)
      );
    }

    if (directionFilter !== "all" && directionFilter.size > 0) {
      filteredRules = filteredRules.filter((rule) =>
        Array.from(directionFilter).includes(rule.direction)
      );
    }

    return filteredRules;
  }, [
    data?.rules,
    filterValue,
    actionFilter,
    directionFilter,
    hasSearchFilter,
  ]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof FirewallRuleDto];
      const second = b[sortDescriptor.column as keyof FirewallRuleDto];

      const aVal = first === undefined || first === null ? "" : String(first);
      const bVal =
        second === undefined || second === null ? "" : String(second);

      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback(
    (rule: FirewallRuleDto, columnKey: React.Key) => {
      const cellValue = rule[columnKey as keyof FirewallRuleDto];

      switch (columnKey) {
        case "enabled":
          return (
            <Chip
              color={rule.enabled ? "success" : "danger"}
              variant="flat"
              size="sm"
            >
              {rule.enabled ? "Aktiv" : "Inaktiv"}
            </Chip>
          );
        case "action":
          const getActionIcon = () => {
            switch (rule.action) {
              case "pass":
                return "solar:check-circle-linear";
              case "block":
                return "solar:close-circle-linear";
              case "reject":
                return "solar:shield-warning-linear";
              default:
                return "solar:question-circle-linear";
            }
          };

          const getActionLabel = () => {
            switch (rule.action) {
              case "pass":
                return "Pass";
              case "block":
                return "Block";
              case "reject":
                return "Reject";
              default:
                return rule.action;
            }
          };

          return (
            <Chip
              color={actionColorMap[rule.action]}
              variant="flat"
              size="sm"
              startContent={<Icon icon={getActionIcon()} />}
            >
              {getActionLabel()}
            </Chip>
          );
        case "direction":
          return (
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  rule.direction === "in"
                    ? "solar:arrow-down-linear"
                    : "solar:arrow-up-linear"
                }
              />
              {rule.direction === "in" ? "Eingehend" : "Ausgehend"}
            </div>
          );
        case "interface":
          return (
            <Chip variant="flat" size="sm">
              {rule.interface || "-"}
            </Chip>
          );
        case "ipprotocol":
          const ipProtocolLabel: Record<string, string> = {
            inet: "IPv4",
            inet6: "IPv6",
            inet46: "IPv4+IPv6",
          };
          return (
            <Chip variant="flat" size="sm" color="primary">
              {ipProtocolLabel[rule.ipprotocol] || rule.ipprotocol || "-"}
            </Chip>
          );
        case "protocol":
          return rule.protocol || "-";
        case "log":
          return (
            <Chip
              color={rule.log ? "success" : "default"}
              variant="dot"
              size="sm"
            >
              {rule.log ? "Aktiv" : "Inaktiv"}
            </Chip>
          );
        case "source":
          return (
            <div className="text-sm">
              <div>{rule.source_net || "any"}</div>
              {rule.source_port && (
                <div className="text-gray-500 text-xs">
                  Port: {rule.source_port}
                </div>
              )}
            </div>
          );
        case "destination":
          return (
            <div className="text-sm">
              <div>{rule.destination_net || "any"}</div>
              {rule.destination_port && (
                <div className="text-gray-500 text-xs">
                  Port: {rule.destination_port}
                </div>
              )}
            </div>
          );
        case "description":
          return (
            <div className="max-w-xs truncate" title={rule.description}>
              {rule.description || "-"}
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Suche nach Beschreibung, Quelle oder Ziel"
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<Icon icon="solar:alt-arrow-down-linear" />}
                  variant="flat"
                >
                  Aktion
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Action Filter"
                closeOnSelect={false}
                selectedKeys={actionFilter}
                selectionMode="multiple"
                onSelectionChange={setActionFilter}
              >
                <DropdownItem key="pass">Pass</DropdownItem>
                <DropdownItem key="block">Block</DropdownItem>
                <DropdownItem key="reject">Reject</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<Icon icon="solar:alt-arrow-down-linear" />}
                  variant="flat"
                >
                  Richtung
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Direction Filter"
                closeOnSelect={false}
                selectedKeys={directionFilter}
                selectionMode="multiple"
                onSelectionChange={setDirectionFilter}
              >
                <DropdownItem key="in">Eingehend</DropdownItem>
                <DropdownItem key="out">Ausgehend</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, actionFilter, directionFilter, onSearchChange, onClear]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Icon
          icon="solar:danger-circle-linear"
          className="text-danger text-6xl mb-4"
        />
        <p className="text-danger">Fehler beim Laden der Firewall-Regeln</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <div className="shrink-0 mb-4">
        <h1 className="text-3xl font-bold mb-2">Firewall Regeln</h1>
      </div>

      <div className="flex-1 min-h-0">
        <Table
          aria-label="Firewall Rules Table"
          isHeaderSticky
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
          classNames={{
            base: "h-full overflow-hidden",
            wrapper: "max-h-full overflow-auto scrollbar-hide",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"Keine Regeln gefunden"}
            items={sortedItems}
            isLoading={isLoading}
            loadingContent={<Spinner label="Lade Regeln..." />}
          >
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FirewallRulesPage;
