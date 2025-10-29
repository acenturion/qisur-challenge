import React from 'react'
import { NavLink } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LayoutDashboard, Package } from 'lucide-react'

const AppSidebar: React.FC = () => {
  const { state } = useSidebar() // "expanded" o "collapsed"
  const isCollapsed = state === "collapsed"
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className='flex-row'>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/acenturion.png" alt="@acenturion" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">acenturion</span>
            <span className="text-xs text-muted-foreground">ac@example.com</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground' : ''}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/products" className={({ isActive }) => isActive ? 'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground' : ''}>
                    <Package />
                    <span>Products</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
