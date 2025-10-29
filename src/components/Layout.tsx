import React from 'react'
import AppSidebar from './Sidebar'
import Header from './Header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full p-2 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
