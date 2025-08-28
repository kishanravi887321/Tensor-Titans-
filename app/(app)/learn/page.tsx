"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"
import { BookOpen, Clock, Target, ArrowRight } from "lucide-react"

export default function LearnPage() {
  const router = useRouter()
  const { currentRole } = useAppStore()

  // If user has a current role, redirect to that role's learning path
  useEffect(() => {
    if (currentRole && ROLES.find((r) => r.id === currentRole)) {
      router.push(`/learn/${currentRole}`)
    }
  }, [currentRole, router])

  const handleRoleSelect = (roleId: string) => {
    router.push(`/learn/${roleId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <p className="text-muted-foreground">
          Choose a role-specific learning path to master AI tools for your job
        </p>
      </div>

      {/* Current Role Quick Access */}
      {currentRole && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Continue Your Learning Path
                </CardTitle>
                <CardDescription>
                  Resume your {ROLES.find((r) => r.id === currentRole)?.label} learning journey
                </CardDescription>
              </div>
              <Button onClick={() => handleRoleSelect(currentRole)}>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Available Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Learning Paths</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ROLES.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentRole === role.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${role.color}`} />
                    <CardTitle className="text-lg">{role.label}</CardTitle>
                  </div>
                  {currentRole === role.id && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Multiple lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Self-paced</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Start Learning
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Path Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Practical Skills</h4>
              <p className="text-sm text-muted-foreground">
                Learn AI tools and techniques that you can apply immediately in your role
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Real-world Projects</h4>
              <p className="text-sm text-muted-foreground">
                Work on projects that mirror actual challenges you face at work
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Progressive Learning</h4>
              <p className="text-sm text-muted-foreground">
                Build expertise step-by-step from basic concepts to advanced applications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
