import React, { FC } from "react";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Selection,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface FirewallTableTopContentProps {
  filterValue: string;
  actionFilter: Selection;
  availableInterfaces: string[];
  availableCategories: string[];
  onClear: () => void;
  onSearchChange: (value?: string) => void;
  onActionFilterChange: (keys: Selection) => void;
  onInterfaceFilterChange: (keys: Selection) => void;
  onCategoryFilterChange: (keys: Selection) => void;
}

const FirewallTableTopContent: FC<FirewallTableTopContentProps> = ({
  filterValue,
  actionFilter,
  availableInterfaces,
  availableCategories,
  onClear,
  onSearchChange,
  onActionFilterChange,
  onInterfaceFilterChange,
  onCategoryFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Suche nach Beschreibung"
          startContent={<Icon icon="solar:magnifer-linear" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-5">
          <Dropdown>
            <DropdownTrigger className="h-[56px]">
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
              <DropdownItem key="Pass">Pass</DropdownItem>
              <DropdownItem key="Block">Block</DropdownItem>
              <DropdownItem key="Reject">Reject</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Select
            isClearable
            label="Raum auswählen"
            className="w-[300px]"
            selectionMode="multiple"
            onSelectionChange={onInterfaceFilterChange}
          >
            {availableInterfaces.map((iface) => (
              <SelectItem key={iface}>{iface}</SelectItem>
            ))}
          </Select>
          <Select
            isClearable
            label="Unterrichtsfach auswählen"
            className="w-[300px]"
            selectionMode="multiple"
            onSelectionChange={onCategoryFilterChange}
          >
            {availableCategories.map((category) => (
              <SelectItem key={category}>{category}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FirewallTableTopContent;
