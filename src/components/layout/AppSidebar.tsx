import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  children?: { title: string; url: string }[];
};

const itpItems: NavItem[] = [
  { title: "Base Reliability Model", url: "/" },
  { title: "Dynamic Stability Model", url: "/dynamic-stability" },
  {
    title: "Market Economic Model",
    url: "/market-economic",
    children: [
      { title: "MEM Generation", url: "/market-economic?track=gen" },
      { title: "MEM Load", url: "/market-economic?track=load" },
    ],
  },
];

const topItems: NavItem[] = [{ title: "Studies", url: "/studies" }];
const bottomItems: NavItem[] = [
  { title: "GI", url: "/gi" },
  { title: "Reports", url: "/reports" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname, search } = useLocation();
  const [itpOpen, setItpOpen] = useState(true);
  const [memOpen, setMemOpen] = useState(true);

  const currentFull = `${pathname}${search}`;
  const isActive = (url: string) => {
    if (url.includes("?")) return currentFull === url;
    if (url === "/market-economic") {
      return pathname === "/market-economic" && !search.includes("track=");
    }
    return pathname === url;
  };

  const enabled = (url: string) =>
    url === "/" || url === "/market-economic" || url.startsWith("/market-economic?");

  const renderItem = (item: NavItem, depth: 0 | 1 | 2 = 0) => {
    const active = isActive(item.url);
    const hasChildren = !!item.children?.length;
    return (
      <div key={item.title}>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={active}>
            <NavLink
              to={item.url}
              onClick={(e) => {
                if (!enabled(item.url)) e.preventDefault();
                if (hasChildren) setMemOpen((v) => !v);
              }}
              className={cn(
                "relative flex items-center text-sm font-medium",
                depth === 1 && "pl-6",
                depth === 2 && "pl-10",
                active
                  ? "text-brand bg-transparent hover:bg-atmo-2"
                  : "text-atmo-10 hover:bg-atmo-2"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-brand rounded-r" />
              )}
              <span className={cn(active && "font-semibold")}>{item.title}</span>
              {hasChildren && !collapsed && (
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    !memOpen && "-rotate-90"
                  )}
                />
              )}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {hasChildren && memOpen && item.children!.map((c) => renderItem(c, 2))}
      </div>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-atmo-3">
      <SidebarContent className="bg-atmo-0 pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((i) => renderItem(i))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setItpOpen((v) => !v)}
                  className="text-atmo-10 text-sm font-semibold hover:bg-atmo-2"
                >
                  <span>ITP</span>
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform",
                        !itpOpen && "-rotate-90"
                      )}
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {itpOpen && itpItems.map((i) => renderItem(i, 1))}

              {bottomItems.map((i) => renderItem(i))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
