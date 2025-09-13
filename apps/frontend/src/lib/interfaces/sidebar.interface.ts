import { LucideIcon } from "lucide-react";

export interface ISidebarGroup {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }[];
}
