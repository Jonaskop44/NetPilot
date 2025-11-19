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

interface ScheduleRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: { ruleUuid: string; revertAt: string }) => void;
  ruleUuid: string;
  currentState: boolean;
}

const ScheduleRuleModal: FC<ScheduleRuleModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  ruleUuid,
  currentState,
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

    // If the time is in the past today, schedule for tomorrow
    if (revertDate <= now) {
      revertDate.setDate(revertDate.getDate() + 1);
    }

    onSchedule({
      ruleUuid,
      revertAt: revertDate.toISOString(),
    });

    onClose();
    setRevertTime("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Regel temporär ändern
        </ModalHeader>
        <ModalBody>
          <div className="bg-default-100 p-3 rounded-lg mb-2">
            <p className="text-sm text-default-600">
              Die Regel wird{" "}
              <strong>
                sofort {currentState ? "deaktiviert" : "aktiviert"}
              </strong>{" "}
              und automatisch um <strong>{revertTime || "..."}</strong> Uhr
              zurückgesetzt.
            </p>
          </div>

          <Input
            type="time"
            label="Zurücksetzen um"
            placeholder="Wähle eine Uhrzeit"
            description="Regel wird zu dieser Uhrzeit automatisch zurückgesetzt"
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
            Jetzt ändern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleRuleModal;
