"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"
import { ChevronDown, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function RoleSwitcher() {
  const [open, setOpen] = useState(false)
  const { currentRole, setCurrentRole } = useAppStore()

  const selectedRole = ROLES.find((role) => role.id === currentRole)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedRole ? selectedRole.label : "Select Role"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Choose Your Role</SheetTitle>
          <SheetDescription>
            Select the role that best matches your current focus to get personalized learning paths.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          {ROLES.map((role) => (
            <Button
              key={role.id}
              variant={currentRole === role.id ? "secondary" : "outline"}
              className={cn("h-auto p-4 justify-start text-left", currentRole === role.id && "ring-2 ring-primary")}
              onClick={() => {
                setCurrentRole(role.id)
                setOpen(false)
              }}
            >
              <div className="flex items-start gap-3 w-full">
                <div className={cn("w-3 h-3 rounded-full mt-1", role.color)} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{role.label}</span>
                    {currentRole === role.id && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
