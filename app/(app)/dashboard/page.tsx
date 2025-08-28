"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { ROLES, MOCK_LESSONS } from "@/lib/mock-data"
import { BookOpen, TrendingUp, Target, Calendar, ChevronRight, Flame, Award } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { currentRole, progress, badges } = useAppStore()

  const completedLessons = progress.filter((p) => p.completed).length
  const totalLessons = MOCK_LESSONS.length
  const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const earnedBadges = badges.filter((b) => b.earned)
  const currentRoleData = ROLES.find((r) => r.id === currentRole)

  const recentActivity = progress
    .filter((p) => p.completed && p.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">
          {currentRoleData
            ? `Ready to level up your ${currentRoleData.label} + AI skills?`
            : "Choose a role to get started with personalized learning"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
            <p className="text-xs text-muted-foreground">of {totalLessons} total lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedBadges.length}</div>
            <p className="text-xs text-muted-foreground">of {badges.length} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>Pick up where you left off or start something new</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentRoleData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${currentRoleData.color}`} />
                  <span className="font-medium">{currentRoleData.label}</span>
                  <Badge variant="secondary">Active Role</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentRoleData.description}</p>
                <Link href={`/learn/${currentRoleData.id}`}>
                  <Button className="w-full">
                    View Learning Path
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Choose your role to get personalized learning recommendations
                </p>
                <Link href="/roles">
                  <Button>
                    Choose Role
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const lesson = MOCK_LESSONS.find((l) => l.id === activity.lessonId)
                  if (!lesson) return null

                  return (
                    <div key={activity.lessonId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">Completed • {lesson.duration} min</p>
                      </div>
                      {activity.rating === "yes" && (
                        <Badge variant="secondary" className="text-xs">
                          Helpful
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Complete your first lesson to see activity here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
