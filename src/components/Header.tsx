import React from 'react'
import { useLocation } from 'react-router'
import ThemeToggle from './ThemeToggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const Header: React.FC = () => {
  const location = useLocation()
  
  const getBreadcrumbItems = () => {
    const path = location.pathname
    if (path === '/dashboard') {
      return (
        <>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">
              Product Manager
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )
    } else if (path === '/products') {
      return (
        <>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">
              Product Manager
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )
    } else if (path === '/products/new') {
      return (
        <>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">
              Product Manager
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )
    }
    return null
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full">
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 flex-1 min-w-0">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-1 sm:mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex-1 min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbItems()}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
