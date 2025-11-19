import React from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { UserDto, UserDtoRole } from "@/api/openapi.schemas";
import {
  ROLE_COLOR_MAP,
  ROLE_ICON_MAP,
  EDIT_ACTIONS,
} from "../../../../app/dashboard/admin/users/constants";

interface UserTableCellProps {
  user: UserDto;
  columnKey: React.Key;
  onEditRole: (userId: number, role: UserDtoRole) => void;
}

export const UserTableCell: React.FC<UserTableCellProps> = ({
  user,
  columnKey,
  onEditRole,
}) => {
  const cellValue = user[columnKey as keyof UserDto];

  switch (columnKey) {
    case "id":
      return (
        <Chip size="md" variant="flat">
          {user.id}
        </Chip>
      );
    case "email":
      return (
        <Chip size="md" variant="flat">
          <a href={`mailto:${user.email}`} className=" hover:underline">
            {user.email}
          </a>
        </Chip>
      );
    case "username":
      return (
        <Chip size="md" variant="flat">
          {user.username}
        </Chip>
      );
    case "role":
      return (
        <Chip
          className="capitalize"
          color={ROLE_COLOR_MAP[user.role]}
          size="md"
          variant="flat"
          startContent={
            <Icon
              icon={ROLE_ICON_MAP[user.role] || "solar:question-circle-linear"}
            />
          }
        >
          {user.role}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="md" variant="light">
                <Icon
                  icon="mingcute:pencil-fill"
                  className="text-default-400"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Benutzer Aktionen">
              {EDIT_ACTIONS.map((action) => (
                <DropdownItem
                  key={action.key}
                  startContent={<Icon icon={action.icon} />}
                  onClick={() => onEditRole(user.id, action.role)}
                >
                  {action.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Tooltip color="danger" content="Benutzer löschen">
            <Button isIconOnly size="md" variant="light" color="danger">
              <Icon icon="solar:trash-bin-trash-bold" />
            </Button>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
};
