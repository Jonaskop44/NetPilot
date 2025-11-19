import React from "react";
import { Pagination } from "@heroui/react";

interface UserTableBottomContentProps {
  page: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export const UserTableBottomContent: React.FC<UserTableBottomContentProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <Pagination
        loop
        isCompact
        showControls
        color="primary"
        page={page}
        total={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
};
