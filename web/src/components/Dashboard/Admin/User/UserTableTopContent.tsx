import React from "react";
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
import { UserDtoRole } from "@/api/openapi.schemas";

interface UserTableTopContentProps {
  filterValue: string;
  roleFilter: Selection;
  onClear: () => void;
  onSearchChange: (value?: string) => void;
  onRoleFilterChange: (keys: Selection) => void;
}

export const UserTableTopContent: React.FC<UserTableTopContentProps> = ({
  filterValue,
  roleFilter,
  onClear,
  onSearchChange,
  onRoleFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Suche nach Name oder E-Mail"
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
                Rollen Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Rollen Filter"
              closeOnSelect={false}
              selectedKeys={roleFilter}
              selectionMode="multiple"
              onSelectionChange={onRoleFilterChange}
            >
              <DropdownItem key={UserDtoRole.ADMINISTRATOR}>
                Administrator
              </DropdownItem>
              <DropdownItem key={UserDtoRole.TEACHER}>Teacher</DropdownItem>
              <DropdownItem key={UserDtoRole.STUDENT}>Student</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
