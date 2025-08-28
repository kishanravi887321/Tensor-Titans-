"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { MOCK_LESSONS } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function ChartSkills() {
  const { progress, currentRole } = useAppStore()

  // Calculate skill mastery based on completed lessons
  const skillData = React.useMemo(() => {
    const skillCounts: Record<string, { total: number; completed: number }> = {}

    MOCK_LESSONS.forEach((lesson) => {
      if (!currentRole || lesson.role === currentRole) {
        lesson.skills.forEach((skill) => {
          if (!skillCounts[skill]) {
            skillCounts[skill] = { total: 0, completed: 0 }
          }
          skillCounts[skill].total++

          const isCompleted = progress.find((p) => p.lessonId === lesson.id)?.completed || false
          if (isCompleted) {
            skillCounts[skill].completed++
          }
        })
      }
    })

    return Object.entries(skillCounts).map(([skill, counts]) => ({
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      mastery: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
      completed: counts.completed,
      total: counts.total,
    }))
  }, [progress, currentRole])

  const radarData = skillData.slice(0, 6) // Limit to 6 skills for better visualization

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, "Mastery"]}
                labelFormatter={(label) => `Skill: ${label}`}
              />
              <Bar dataKey="mastery" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" fontSize={12} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip formatter={(value) => [`${value}%`, "Mastery"]} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
