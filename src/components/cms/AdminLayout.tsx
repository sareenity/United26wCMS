import { type ReactNode } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Users, LogOut } from "lucide-react"
import { logout } from "@/lib/cmsApi"

interface AdminLayoutProps {
  children: ReactNode
  onLogout: () => void
  breadcrumb?: string
}

export function AdminLayout({ children, onLogout, breadcrumb = "Members" }: AdminLayoutProps) {
  function handleLogout() {
    logout()
    onLogout()
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border py-3 px-3">
          <div className="flex items-center gap-2 px-1">
            <img
              src="/BNiUnited_Logo_Color_1.png"
              alt="BNI United"
              className="h-8 object-contain"
            />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-semibold leading-tight text-sidebar-foreground">
                BNI United
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 leading-tight">
                CMS Admin
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Members">
                <Users size={16} />
                <span>Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Log out"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border px-4 shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground text-sm">BNI United CMS</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">{breadcrumb}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground text-xs hidden sm:flex"
            >
              <LogOut size={12} />
              Log out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
