import type { ChipProps } from "@heroui/react";

export const COLUMNS = [
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
  { name: "AKTIONEN", uid: "actions" },
];

export const ACTION_COLOR_MAP: Record<string, ChipProps["color"]> = {
  pass: "success",
  block: "danger",
  reject: "danger",
};

export const ACTION_ICON_MAP: Record<string, string> = {
  pass: "solar:check-circle-linear",
  block: "solar:close-circle-linear",
  reject: "solar:shield-warning-linear",
};

export const ACTION_LABELS: Record<string, string> = {
  pass: "Pass",
  block: "Block",
  reject: "Reject",
};

export const IP_PROTOCOL_LABELS: Record<string, string> = {
  inet: "IPv4",
  inet6: "IPv6",
  inet46: "IPv4+IPv6",
};

export const DIRECTION_ICON_MAP: Record<string, string> = {
  in: "solar:arrow-down-linear",
  out: "solar:arrow-up-linear",
};

export const DIRECTION_LABELS: Record<string, string> = {
  in: "Eingehend",
  out: "Ausgehend",
};
