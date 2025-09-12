import { LucideIcon } from "lucide-react";

export interface ISidebarSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface ISidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: ISidebarSubItem[];
}

export interface ISidebarGroup {
  items: ISidebarItem[];
}
