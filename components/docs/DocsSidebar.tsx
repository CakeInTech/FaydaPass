"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Book, Code, Shield } from "lucide-react";

export function DocsSidebar() {
  return (
    <aside className="fixed top-20 z-20 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <Sidebar className="h-full" collapsible="icon">
        <SidebarContent className="h-full bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <a href="/docs">
                  <Book className="size-4 text-[#6B46C1]" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Code className="size-4 text-[#6B46C1]" />
                  API Reference
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <a href="#">
                  <Shield className="size-4 text-[#6B46C1]" />
                  Guides
                </a>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">
                    Authentication
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">
                    Verification Flow
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}