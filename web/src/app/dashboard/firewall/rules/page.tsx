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
  Pagination,
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
  { name: "PROTOKOLL", uid: "protocol" },
  { name: "QUELLE", uid: "source" },
  { name: "ZIEL", uid: "destination" },
  { name: "BESCHREIBUNG", uid: "description" },
  { name: "STATISTIKEN", uid: "stats" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  true: "success",
  false: "default",
};

const actionColorMap: Record<string, ChipProps["color"]> = {
  Pass: "success",
  Block: "danger",
};

const FirewallRulesPage = () => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedInterface, setSelectedInterface] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<Selection>("all");
  const [directionFilter, setDirectionFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "action",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useFirewallControllerGetAllFirewallRules({
    interface: selectedInterface || undefined,
    page,
    limit: rowsPerPage,
  });

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
              color={statusColorMap[String(rule.enabled)]}
              variant="flat"
              size="sm"
            >
              {rule.enabled ? "Aktiv" : "Inaktiv"}
            </Chip>
          );
        case "action":
          return (
            <Chip
              color={actionColorMap[rule.action]}
              variant="flat"
              size="sm"
              startContent={
                <Icon
                  icon={
                    rule.action === "Pass"
                      ? "solar:check-circle-linear"
                      : "solar:close-circle-linear"
                  }
                />
              }
            >
              {rule.action}
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
        case "protocol":
          return rule.protocol || rule.ipprotocol || "-";
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
        case "stats":
          return (
            <div className="text-xs text-gray-500">
              <div>Pakete: {rule.packets || 0}</div>
              <div>Bytes: {rule.bytes || 0}</div>
              <div>States: {rule.states || 0}</div>
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
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Suche nach Beschreibung, Quelle oder Ziel..."
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
                  Interface
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Interface Filter"
                selectedKeys={selectedInterface ? [selectedInterface] : []}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedInterface(selected || "");
                  setPage(1);
                }}
              >
                <DropdownItem key="">Alle</DropdownItem>
                <DropdownItem key="lan">LAN</DropdownItem>
                <DropdownItem key="wan">WAN</DropdownItem>
              </DropdownMenu>
            </Dropdown>

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
                <DropdownItem key="Pass">Pass</DropdownItem>
                <DropdownItem key="Block">Block</DropdownItem>
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
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Gesamt {data?.total || 0} Regeln
          </span>
          <label className="flex items-center text-default-400 text-small">
            Zeilen pro Seite:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    selectedInterface,
    actionFilter,
    directionFilter,
    data?.total,
    rowsPerPage,
    onSearchChange,
    onClear,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={data?.totalPages || 1}
          onChange={setPage}
        />
      </div>
    );
  }, [page, data?.totalPages]);

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
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0">
        <h1 className="text-3xl font-bold mb-2">Firewall Regeln</h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <Table
          aria-label="Firewall Rules Table"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
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
