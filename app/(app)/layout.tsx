"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserMenu } from "@/components/user-menu"
import { RoleSwitcher } from "@/components/role-switcher"
import { CoachPanel } from "@/components/coach-panel"
import { Button } from "@/components/ui/button"
import { Search, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Suspense } from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-card/50 lg:backdrop-blur-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarNav />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            {/* Mobile Menu */}
            <Suspense fallback={<div>Loading...</div>}>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarNav />
                </SheetContent>
              </Sheet>
            </Suspense>

            {/* Role Switcher */}
            <Suspense fallback={<div>Loading...</div>}>
              <RoleSwitcher />
            </Suspense>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <Button variant="outline" className="w-full justify-start text-muted-foreground bg-transparent">
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Search lessons...</span>
                <span className="sm:hidden">Search...</span>
              </Button>
            </div>

            {/* User Menu */}
            <Suspense fallback={<div>Loading...</div>}>
              <UserMenu />
            </Suspense>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex">
          <main className="flex-1 p-4 sm:p-6">{children}</main>

          {/* Desktop Coach Panel */}
          <div className="hidden lg:block">
            <Suspense fallback={<div>Loading...</div>}>
              <CoachPanel />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Coach Panel */}
      <div className="lg:hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <CoachPanel />
        </Suspense>
      </div>
    </div>
  )
}
