"use client";

import { Calendar, DatabaseIcon, HomeIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import SidebarHeaderSection from "./Header";
import SidebarContentSection from "./Content";
import { ISidebarGroup } from "@/lib/interfaces/sidebar.interface";

const sidebarItems: ISidebarGroup[] = [
  {
    items: [
      {
        title: "My Projects",
        url: "#",
        icon: DatabaseIcon,
        items: [
          { title: "Project A", url: "/projects/a" },
          { title: "Project B", url: "/projects/b" },
          { title: "Project C", url: "/projects/c" },
        ],
      },
    ],
  },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarHeaderSection isCollapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton asChild tooltip={"Home"}>
              <Link href="/" className="flex items-center gap-3">
                <HomeIcon className="h-5 w-5" />
                <span className="text-gray-700 font-medium">Home</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip={"Today"}>
              <Link href="/" className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <span className="text-gray-700 font-medium">Today</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        {sidebarItems.map((group, index) => (
          <SidebarContentSection key={index} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
