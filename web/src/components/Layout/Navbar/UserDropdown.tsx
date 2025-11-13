import { useAuth } from "@/hooks/useAuth";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { FC } from "react";

interface UserDropdownProps {
  isMobile: boolean;
}

const UserDropdown: FC<UserDropdownProps> = ({ isMobile }) => {
  const { user, logout } = useAuth();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          className="transition-transform"
          name={isMobile ? user?.username : undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownSection showDivider title="User Actions">
          <DropdownItem
            key="settings"
            startContent={<Icon icon="solar:settings-linear" />}
          >
            Einstellungen
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            onClick={logout}
            key="logout"
            color="danger"
            startContent={<Icon icon="solar:logout-3-line-duotone" />}
          >
            Abmelden
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
