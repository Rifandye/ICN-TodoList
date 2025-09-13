"use client";

import { DatabaseIcon, HomeIcon } from "lucide-react";
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
import { useProjectStore } from "@/store/projectStore";
import { useAuthStore } from "@/store/authStore";

export default function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { projects, isLoading } = useProjectStore();
  const { isAuthenticated } = useAuthStore();

  const sidebarItems: ISidebarGroup[] = [
    {
      items: [
        {
          title: "My Projects",
          url: "#",
          icon: DatabaseIcon,
          items: isLoading
            ? [{ title: "Loading...", url: "#" }]
            : projects.length > 0
            ? projects.slice(0, 10).map((project) => ({
                title: project.name,
                url: `/dashboard/project/${project.id}`,
              }))
            : [{ title: "No projects yet", url: "/dashboard" }],
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarHeaderSection isCollapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton asChild tooltip={"Home"}>
              <Link href="/dashboard" className="flex items-center gap-3">
                <HomeIcon className="h-5 w-5" />
                <span className="text-gray-700 font-medium">Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        {isAuthenticated && (
          <>
            {sidebarItems.map((group, index) => (
              <SidebarContentSection key={index} {...group} />
            ))}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
