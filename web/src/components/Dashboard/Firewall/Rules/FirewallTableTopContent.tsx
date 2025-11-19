import React, { FC } from "react";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Selection,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface FirewallTableTopContentProps {
  filterValue: string;
  actionFilter: Selection;
  directionFilter: Selection;
  onClear: () => void;
  onSearchChange: (value?: string) => void;
  onActionFilterChange: (keys: Selection) => void;
  onDirectionFilterChange: (keys: Selection) => void;
  onAddRule: () => void;
}

const FirewallTableTopContent: FC<FirewallTableTopContentProps> = ({
  filterValue,
  actionFilter,
  directionFilter,
  onClear,
  onSearchChange,
  onActionFilterChange,
  onDirectionFilterChange,
  onAddRule,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Suche nach Beschreibung, Quelle oder Ziel"
          startContent={<Icon icon="solar:magnifer-linear" />}
          value={filterValue}
          onClear={onClear}
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
              onSelectionChange={onActionFilterChange}
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
              onSelectionChange={onDirectionFilterChange}
            >
              <DropdownItem key="in">Eingehend</DropdownItem>
              <DropdownItem key="out">Ausgehend</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            color="primary"
            startContent={<Icon icon="humbleicons:plus" />}
            onPress={onAddRule}
          >
            Regel hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirewallTableTopContent;
