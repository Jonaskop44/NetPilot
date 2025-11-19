import { Icon } from "@iconify/react";
import { FC } from "react";

interface TableErrorProps {
  message?: string;
}

const TableError: FC<TableErrorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Icon
        icon="solar:danger-circle-linear"
        className="text-danger text-6xl mb-4"
      />
      <p className="text-danger">{message || "Fehler beim Laden der Daten"}</p>
    </div>
  );
};

export default TableError;
