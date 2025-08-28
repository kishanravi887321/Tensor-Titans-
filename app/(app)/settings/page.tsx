"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"
import { User, Palette, Bell, Shield, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { currentRole, setCurrentRole, progress, badges } = useAppStore()

  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    weeklyProgress: true,
    badgeEarned: true,
    coachTips: false,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export not available",
      description: "Data export is not available in the UI-only demo version.",
      variant: "destructive",
    })
  }

  const handleDeleteData = () => {
    toast({
      title: "Delete not available",
      description: "Data deletion is not available in the UI-only demo version.",
      variant: "destructive",
    })
  }

  const currentRoleData = ROLES.find((r) => r.id === currentRole)
  const completedLessons = progress.filter((p) => p.completed).length
  const earnedBadges = badges.filter((b) => b.earned).length

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and learning preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information and learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold">{session?.user?.name}</h3>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{completedLessons} lessons completed</Badge>
                  <Badge variant="secondary">{earnedBadges} badges earned</Badge>
                </div>
              </div>
            </div>

            {/* Current Role */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Primary Learning Role</label>
              <Select value={currentRole || ""} onValueChange={(value) => setCurrentRole(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${role.color}`} />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentRoleData && <p className="text-xs text-muted-foreground">{currentRoleData.description}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how Saskin looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your preferred theme or sync with your system settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Control what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Lesson Reminders</label>
                  <p className="text-xs text-muted-foreground">Get reminded to continue your learning</p>
                </div>
                <Switch
                  checked={notifications.lessonReminders}
                  onCheckedChange={(checked) => handleNotificationChange("lessonReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Weekly Progress</label>
                  <p className="text-xs text-muted-foreground">Weekly summary of your learning progress</p>
                </div>
                <Switch
                  checked={notifications.weeklyProgress}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyProgress", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Badge Notifications</label>
                  <p className="text-xs text-muted-foreground">Get notified when you earn new badges</p>
                </div>
                <Switch
                  checked={notifications.badgeEarned}
                  onCheckedChange={(checked) => handleNotificationChange("badgeEarned", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">AI Coach Tips</label>
                  <p className="text-xs text-muted-foreground">Receive personalized tips from your AI coach</p>
                </div>
                <Switch
                  checked={notifications.coachTips}
                  onCheckedChange={(checked) => handleNotificationChange("coachTips", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="w-full justify-start gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
              <p className="text-xs text-muted-foreground">
                Download a copy of your learning progress, badges, and settings
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Button variant="destructive" onClick={handleDeleteData} className="w-full justify-start gap-2">
                <Trash2 className="h-4 w-4" />
                Delete All Data
              </Button>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
