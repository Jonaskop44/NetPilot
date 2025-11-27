import React, { FC, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface BulkScheduleRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (revertAt: string) => void;
  ruleCount: number;
  groupType: string;
}

const BulkScheduleRuleModal: FC<BulkScheduleRuleModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  ruleCount,
  groupType,
}) => {
  const [revertTime, setRevertTime] = useState("");

  const handleSchedule = () => {
    if (!revertTime) {
      return;
    }

    // Convert HH:mm to ISO date string
    const [hours, minutes] = revertTime.split(":");
    const now = new Date();
    const revertDate = new Date();
    revertDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // If the time is in the past today, show error
    if (revertDate <= now) {
      toast.error("Ihre Uhrzeit befindet sich in der Vergangenheit");
      return;
    }

    onSchedule(revertDate.toISOString());
    onClose();
    setRevertTime("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Mehrere Regeln temporär ändern
        </ModalHeader>
        <ModalBody>
          <div className="bg-default-100 p-3 rounded-lg mb-2">
            <p className="text-sm text-default-600">
              <strong>{ruleCount} Regeln</strong> der Gruppe{" "}
              <strong>{groupType}</strong> werden sofort umgeschaltet und
              automatisch um <strong>{revertTime || "..."}</strong> Uhr
              zurückgesetzt.
            </p>
          </div>

          <Input
            type="time"
            label="Zurücksetzen um"
            placeholder="Wähle eine Uhrzeit"
            description="Regeln werden zu dieser Uhrzeit automatisch zurückgesetzt"
            value={revertTime}
            onChange={(e) => setRevertTime(e.target.value)}
            startContent={<Icon icon="solar:clock-circle-linear" />}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Abbrechen
          </Button>
          <Button
            color="primary"
            onPress={handleSchedule}
            isDisabled={!revertTime}
            startContent={<Icon icon="solar:calendar-add-linear" />}
          >
            Alle Jetzt ändern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkScheduleRuleModal;
