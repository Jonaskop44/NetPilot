type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: {
    name: string;
    path: string;
  }[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
};
