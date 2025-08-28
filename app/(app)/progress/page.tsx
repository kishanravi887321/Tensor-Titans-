"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/progress-ring"
import { BadgeList } from "@/components/badge-list"
import { ChartSkills } from "@/components/charts/chart-skills"
import { useAppStore } from "@/lib/store"
import { MOCK_LESSONS, ROLES } from "@/lib/mock-data"
import { Calendar, Clock, Target, Award, Download, Flame, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProgressPage() {
  const { toast } = useToast()
  const { progress, badges, currentRole } = useAppStore()

  const completedLessons = progress.filter((p) => p.completed)
  const totalLessons = MOCK_LESSONS.length
  const completionPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  const earnedBadges = badges.filter((b) => b.earned)
  const currentRoleData = ROLES.find((r) => r.id === currentRole)

  // Calculate streak (mock data for demo)
  const currentStreak = 3
  const longestStreak = 7

  // Recent activity
  const recentActivity = completedLessons
    .filter((p) => p.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5)

  // Time spent learning (mock calculation)
  const totalTimeSpent = completedLessons.reduce((acc, p) => {
    const lesson = MOCK_LESSONS.find((l) => l.id === p.lessonId)
    return acc + (lesson?.duration || 0)
  }, 0)

  const handleExportProgress = () => {
    toast({
      title: "Export not available",
      description: "Progress export is not available in the UI-only demo version.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Track your AI learning journey and achievements</p>
        </div>
        <Button variant="outline" onClick={handleExportProgress} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Progress
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons.length}</div>
            <p className="text-xs text-muted-foreground">of {totalLessons} total lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeSpent}m</div>
            <p className="text-xs text-muted-foreground">learning time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Ring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Progress
            </CardTitle>
            <CardDescription>Your completion across all lessons</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <ProgressRing progress={completionPercentage} size={140}>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </ProgressRing>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">{completedLessons.length} lessons completed</p>
              <p className="text-xs text-muted-foreground">{totalLessons - completedLessons.length} remaining</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Role Progress */}
        {currentRoleData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${currentRoleData.color}`} />
                {currentRoleData.label} Progress
              </CardTitle>
              <CardDescription>Your progress in the active role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const roleLessons = MOCK_LESSONS.filter((l) => l.role === currentRole)
                const roleCompleted = completedLessons.filter((p) =>
                  roleLessons.some((l) => l.id === p.lessonId),
                ).length
                const rolePercentage = roleLessons.length > 0 ? (roleCompleted / roleLessons.length) * 100 : 0

                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lessons</span>
                        <span>
                          {roleCompleted}/{roleLessons.length}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${rolePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(rolePercentage)}%</div>
                      <div className="text-xs text-muted-foreground">Role Mastery</div>
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Streak Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Learning Streak
            </CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Longest Streak</span>
                <span className="font-medium">{longestStreak} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>This Week</span>
                <span className="font-medium">3 days</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Complete a lesson today to extend your streak!
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Chart */}
      <ChartSkills />

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
                  <div key={activity.lessonId} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {lesson.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{lesson.duration} min • Completed</span>
                        {activity.rating === "yes" && (
                          <Badge variant="secondary" className="text-xs">
                            Helpful
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.completedAt && new Date(activity.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Complete your first lesson to see activity here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Badges you've earned and goals to work towards</CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeList />
        </CardContent>
      </Card>
    </div>
  )
}
