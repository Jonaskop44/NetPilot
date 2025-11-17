"use client";

import type { ChipProps } from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Selection,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
} from "@heroui/react";
import { useAdminControllerGetAllUsers } from "@/api/admin/admin";
import { UserDtoRole, type UserDto } from "@/api/openapi.schemas";
import { Icon } from "@iconify/react";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "USERNAME", uid: "username" },
  { name: "ROLE", uid: "role", sortable: true },
];

const roleColorMap: Record<string, ChipProps["color"]> = {
  ADMINISTRATOR: "success",
  TEACHER: "primary",
  STUDENT: "warning",
};

const UsersPage = () => {
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const { data, isLoading, error } = useAdminControllerGetAllUsers({ page: 1 });

  const hasSearchFilter = Boolean(filterValue);

  const filteredUsers = useMemo(() => {
    let filteredItems = [...(data?.users || [])];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter(
        (user) =>
          user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (roleFilter !== "all" && roleFilter.size > 0) {
      filteredItems = filteredItems.filter((user) =>
        Array.from(roleFilter).includes(user.role)
      );
    }

    return filteredItems;
  }, [data?.users, filterValue, hasSearchFilter, roleFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof UserDto];
      const second = b[sortDescriptor.column as keyof UserDto];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredUsers, sortDescriptor]);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Suche nach Name oder E-Mail"
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
                  Rollen Filter
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Rollen Filter"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
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
  }, [filterValue, onClear, onSearchChange, roleFilter]);

  const renderCell = useCallback((user: UserDto, columnKey: React.Key) => {
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
        const getRoleIcon = () => {
          switch (user.role) {
            case "ADMINISTRATOR":
              return "solar:crown-line-duotone";
            case "TEACHER":
              return "solar:meditation-bold";
            case "STUDENT":
              return "solar:face-scan-circle-linear";
            default:
              return "solar:question-circle-linear";
          }
        };

        return (
          <Chip
            className="capitalize"
            color={roleColorMap[user.role]}
            size="md"
            variant="flat"
            startContent={<Icon icon={getRoleIcon()} />}
          >
            {user.role}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Icon
          icon="solar:danger-circle-linear"
          className="text-danger text-6xl mb-4"
        />
        <p className="text-danger">Fehler beim Laden der User</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <div className="shrink-0 mb-4">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
      </div>
      <div className="flex-1 min-h-0">
        <Table
          aria-label="Users table"
          isHeaderSticky
          topContent={topContent}
          topContentPlacement="outside"
          sortDescriptor={sortDescriptor}
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
            emptyContent={"Keine User gefunden"}
            isLoading={isLoading}
            loadingContent={<Spinner label="Lade Users..." />}
            items={sortedUsers}
          >
            {(item) => (
              <TableRow key={item.id}>
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

export default UsersPage;
