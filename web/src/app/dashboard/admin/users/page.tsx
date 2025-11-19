"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import {
  useAdminControllerDeleteUser,
  useAdminControllerEditUserRole,
  useAdminControllerGetAllUsers,
} from "@/api/admin/admin";
import type { UserDtoRole } from "@/api/openapi.schemas";
import { COLUMNS } from "./constants";
import useUserFilters from "../../../../hooks/admin/user/useUserFilters";
import useUserSorting from "../../../../hooks/admin/user/useUserSorting";
import UserTableTopContent from "../../../../components/Dashboard/Admin/User/UserTableTopContent";
import UserTableBottomContent from "../../../../components/Dashboard/Admin/User/UserTableBottomContent";
import UserTableCell from "../../../../components/Dashboard/Admin/User/UserTableCell";
import TableError from "@/components/Common/TableError";
import { toast } from "sonner";

const UsersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useAdminControllerGetAllUsers({
    page,
  });
  const { mutate: editUserRole } = useAdminControllerEditUserRole();
  const { mutate: deleteUser } = useAdminControllerDeleteUser();

  const {
    filterValue,
    roleFilter,
    filteredUsers,
    setRoleFilter,
    onClear,
    onSearchChange,
  } = useUserFilters(data?.users);

  const { sortDescriptor, setSortDescriptor, sortedUsers } =
    useUserSorting(filteredUsers);

  const handleEditRole = (userId: number, role: UserDtoRole) => {
    editUserRole(
      {
        id: userId,
        data: { role },
      },
      {
        onSuccess: () => {
          toast.success("Rolle erfolgreich aktualisiert");
          refetch();
        },
        onError() {
          toast.error(`Fehler beim Aktualisieren der Rolle`);
        },
      }
    );
  };

  const handleDeleteUser = (userId: number) => {
    deleteUser(
      { id: userId },
      {
        onSuccess: () => {
          toast.success("User erfolgreich gelöscht");
          refetch();
        },
        onError() {
          toast.error(`Fehler beim Löschen des Users`);
        },
      }
    );
  };

  if (error) {
    return <TableError />;
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
          topContent={
            <UserTableTopContent
              filterValue={filterValue}
              roleFilter={roleFilter}
              onClear={onClear}
              onSearchChange={onSearchChange}
              onRoleFilterChange={setRoleFilter}
            />
          }
          topContentPlacement="outside"
          bottomContent={
            <UserTableBottomContent
              page={page}
              totalPages={data?.totalPages}
              onPageChange={setPage}
            />
          }
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          classNames={{
            base: "h-full overflow-hidden",
            wrapper: "max-h-full overflow-auto scrollbar-hide",
          }}
        >
          <TableHeader columns={COLUMNS}>
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
                  <TableCell>
                    <UserTableCell
                      user={item}
                      columnKey={columnKey}
                      onEditRole={handleEditRole}
                      onDeleteUser={handleDeleteUser}
                    />
                  </TableCell>
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
