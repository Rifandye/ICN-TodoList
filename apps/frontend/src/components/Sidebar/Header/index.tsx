"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export default function SidebarHeaderSection({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          {isCollapsed ? (
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" />
              <AvatarFallback className="bg-[#F86800] text-white">
                CM
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-3">
              <Image
                priority
                src="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                width={120}
                height={32}
                quality={100}
                alt="CRMax Logo"
                loading="eager"
                className="object-contain"
              />
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
