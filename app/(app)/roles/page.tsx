"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { ROLES, MOCK_LESSONS } from "@/lib/mock-data"
import { ChevronRight, BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function RolesPage() {
  const { currentRole, setCurrentRole, progress } = useAppStore()

  const getRoleStats = (roleId: string) => {
    const roleLessons = MOCK_LESSONS.filter((lesson) => lesson.id.startsWith(roleId))
    const completedLessons = progress.filter(
      (p) => p.completed && roleLessons.some((lesson) => lesson.id === p.lessonId),
    ).length

    return {
      total: roleLessons.length,
      completed: completedLessons,
      duration: roleLessons.reduce((acc, lesson) => acc + lesson.duration, 0),
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Choose Your Role</h1>
        <p className="text-muted-foreground mt-1">
          Select the role that best matches your current focus to get personalized learning paths
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {ROLES.map((role) => {
          const stats = getRoleStats(role.id)
          const isActive = currentRole === role.id

          return (
            <Card
              key={role.id}
              className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer",
                isActive && "ring-2 ring-primary shadow-md",
              )}
              onClick={() => setCurrentRole(role.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded-full", role.color)} />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {role.label}
                        {isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">{role.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{stats.total} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{stats.duration} min total</span>
                  </div>
                </div>

                {/* Progress */}
                {stats.completed > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {stats.completed}/{stats.total} completed
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/learn/${role.id}`} className="flex-1">
                    <Button variant={isActive ? "default" : "outline"} className="w-full">
                      {stats.completed > 0 ? "Continue Learning" : "Start Learning"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  {!isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentRole(role.id)
                      }}
                    >
                      Set Active
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Getting Started Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="text-lg">Getting Started Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Choose your primary role</p>
                <p className="text-xs text-muted-foreground">Focus on one role to start, you can always switch later</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Start with short lessons</p>
                <p className="text-xs text-muted-foreground">
                  Each lesson takes 5-10 minutes and builds practical skills
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
