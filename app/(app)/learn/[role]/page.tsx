"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LessonCard } from "@/components/lesson-card"
import { useAppStore } from "@/lib/store"
import { ROLES, MOCK_LESSONS } from "@/lib/mock-data"
import type { Role } from "@/types/models"
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react"

export default function LearnRolePage() {
  const params = useParams()
  const role = params.role as Role
  const { progress, setCurrentRole } = useAppStore()

  // Set current role when visiting this page
  if (role && ROLES.find((r) => r.id === role)) {
    setCurrentRole(role)
  }

  const roleData = ROLES.find((r) => r.id === role)
  const roleLessons = MOCK_LESSONS.filter((lesson) => lesson.role === role)
  const regularLessons = roleLessons.filter((lesson) => !lesson.project)
  const projectLessons = roleLessons.filter((lesson) => lesson.project)

  const completedLessons = progress.filter(
    (p) => p.completed && roleLessons.some((lesson) => lesson.id === p.lessonId),
  ).length

  const totalDuration = roleLessons.reduce((acc, lesson) => acc + lesson.duration, 0)
  const completionPercentage = roleLessons.length > 0 ? (completedLessons / roleLessons.length) * 100 : 0

  if (!roleData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Role not found</h1>
        <p className="text-muted-foreground mt-2">The requested learning path does not exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${roleData.color}`} />
          <h1 className="text-3xl font-bold">{roleData.label} Learning Path</h1>
        </div>
        <p className="text-muted-foreground text-lg">{roleData.description}</p>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleLessons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLessons}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDuration}m</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
              <Progress value={completionPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regular Lessons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Lessons</h2>
          <Badge variant="secondary">{regularLessons.length} lessons</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {regularLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>

      {/* Project Lessons */}
      {projectLessons.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Hands-On Projects</h2>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
            >
              {projectLessons.length} projects
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projectLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      )}

      {/* Learning Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="text-lg">Learning Tips for {roleData.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-medium text-sm">Start with the basics</p>
              <p className="text-xs text-muted-foreground">
                Begin with foundational lessons before moving to advanced topics
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Practice regularly</p>
              <p className="text-xs text-muted-foreground">
                Consistent practice helps build muscle memory for AI prompting
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Experiment freely</p>
              <p className="text-xs text-muted-foreground">Try different approaches and learn from the feedback</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Apply to real work</p>
              <p className="text-xs text-muted-foreground">Use what you learn in your actual day-to-day tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
