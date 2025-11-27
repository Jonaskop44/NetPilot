import type { ChipProps } from "@heroui/react";

export const COLUMNS = [
  { name: "STATUS", uid: "enabled", sortable: true },
  { name: "AKTION", uid: "action", sortable: true },
  { name: "RAUM", uid: "interface" },
  { name: "UNTERRICHTSFACH", uid: "categories" },
  { name: "BESCHREIBUNG", uid: "description" },
  { name: "AKTIONEN", uid: "actions" },
];

export const ACTION_COLOR_MAP: Record<string, ChipProps["color"]> = {
  Pass: "success",
  Block: "danger",
  Reject: "danger",
};

export const ACTION_ICON_MAP: Record<string, string> = {
  Pass: "solar:check-circle-linear",
  Block: "solar:close-circle-linear",
  Reject: "solar:shield-warning-linear",
};

export const ACTION_LABELS: Record<string, string> = {
  Pass: "Pass",
  Block: "Block",
  Reject: "Reject",
};
