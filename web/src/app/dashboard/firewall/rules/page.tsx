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
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

const FirewallRulesPage = () => {
  const [selectedInterface, setSelectedInterface] = useState<string>("");

  const { data, isLoading, error } = useFirewallControllerGetAllFirewallRules({
    interface: selectedInterface || undefined,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Icon
          icon="solar:danger-circle-linear"
          className="text-danger text-6xl mb-4"
        />
        <p className="text-danger">Fehler beim Laden der Firewall-Regeln</p>
      </div>
    );
  }

  const rules = data?.rules || [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Firewall Regeln</h1>
          <p className="text-gray-500 mt-2">
            Gesamt: {data?.total || 0} Regeln
          </p>
        </div>

        <Select
          label="Interface"
          placeholder="Alle Interfaces"
          className="max-w-xs"
          selectedKeys={selectedInterface ? [selectedInterface] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setSelectedInterface(selected || "");
          }}
        >
          <SelectItem key="">Alle</SelectItem>
          <SelectItem key="lan">LAN</SelectItem>
          <SelectItem key="wan">WAN</SelectItem>
        </Select>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <Table aria-label="Firewall Rules Table" removeWrapper>
          <TableHeader>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>AKTION</TableColumn>
            <TableColumn>RICHTUNG</TableColumn>
            <TableColumn>INTERFACE</TableColumn>
            <TableColumn>PROTOKOLL</TableColumn>
            <TableColumn>QUELLE</TableColumn>
            <TableColumn>ZIEL</TableColumn>
            <TableColumn>BESCHREIBUNG</TableColumn>
            <TableColumn>STATISTIKEN</TableColumn>
          </TableHeader>
          <TableBody>
            {rules.map((rule: FirewallRuleDto) => (
              <TableRow key={rule.uuid}>
                <TableCell>
                  <Chip
                    color={rule.enabled ? "success" : "default"}
                    variant="flat"
                    size="sm"
                  >
                    {rule.enabled ? "Aktiv" : "Inaktiv"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={rule.action === "Pass" ? "success" : "danger"}
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
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Chip variant="flat" size="sm">
                    {rule.interface || "-"}
                  </Chip>
                </TableCell>
                <TableCell>{rule.protocol || rule.ipprotocol || "-"}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{rule.source_net || "any"}</div>
                    {rule.source_port && (
                      <div className="text-gray-500 text-xs">
                        Port: {rule.source_port}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{rule.destination_net || "any"}</div>
                    {rule.destination_port && (
                      <div className="text-gray-500 text-xs">
                        Port: {rule.destination_port}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={rule.description}>
                    {rule.description || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-gray-500">
                    <div>Pakete: {rule.packets || 0}</div>
                    <div>Bytes: {rule.bytes || 0}</div>
                    <div>States: {rule.states || 0}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FirewallRulesPage;
