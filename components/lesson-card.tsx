"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import type { Lesson } from "@/types/models"
import { Clock, CheckCircle, Play, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface LessonCardProps {
  lesson: Lesson
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { progress } = useAppStore()
  const isCompleted = progress.find((p) => p.lessonId === lesson.id)?.completed || false

  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-md", isCompleted && "bg-green-50 dark:bg-green-950/20")}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {lesson.project ? (
                <FolderOpen className="h-5 w-5 text-orange-500" />
              ) : (
                <Play className="h-5 w-5 text-blue-500" />
              )}
              {lesson.title}
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription className="mt-1">{lesson.description}</CardDescription>
          </div>
          {lesson.project && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
            >
              Project
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Duration and Skills */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration} min</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {lesson.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Link href={lesson.project ? `/project/${lesson.id}` : `/lesson/${lesson.id}`}>
          <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
            {isCompleted ? "Review" : lesson.project ? "Start Project" : "Start Lesson"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
