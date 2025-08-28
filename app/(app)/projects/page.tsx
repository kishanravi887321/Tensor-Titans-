"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { MOCK_LESSONS, ROLES } from "@/lib/mock-data"
import { FolderOpen, Clock, Users, ArrowRight, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectsPage() {
  const router = useRouter()
  const { progress, currentRole } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")

  // Get project lessons (lessons marked as projects)
  const projectLessons = MOCK_LESSONS.filter((lesson) => lesson.project)

  // Filter projects based on search and role filter
  const filteredProjects = projectLessons.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || project.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleProjectSelect = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  const getProjectProgress = (projectId: string) => {
    const projectProgress = progress.find((p) => p.lessonId === projectId)
    return projectProgress?.completed ? 100 : 0
  }

  const getRoleData = (roleId: string) => {
    return ROLES.find((r) => r.id === roleId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Badge variant="secondary">New</Badge>
        </div>
        <p className="text-muted-foreground">
          Apply your AI skills to real-world projects and build a portfolio
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const roleData = getRoleData(project.role)
          const progressValue = getProjectProgress(project.id)
          const isCompleted = progressValue === 100

          return (
            <Card
              key={project.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleProjectSelect(project.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {roleData && (
                        <Badge variant="outline" className="text-xs">
                          <div className={`w-2 h-2 rounded-full ${roleData.color} mr-1`} />
                          {roleData.label}
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="default" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <FolderOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>

                  {/* Project Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Solo</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isCompleted ? "Review" : "Start"}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Projects will appear here as you progress through learning paths."}
            </p>
            {(searchTerm || filterRole !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterRole("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      {filteredProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Start Building?</CardTitle>
            <CardDescription>
              Projects help you apply what you've learned and create real deliverables for your work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Real-world Application</h4>
                <p className="text-sm text-muted-foreground">
                  Work on projects that mirror challenges in your actual job
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Portfolio Building</h4>
                <p className="text-sm text-muted-foreground">
                  Create tangible outputs you can showcase to your team
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Guided Practice</h4>
                <p className="text-sm text-muted-foreground">
                  Step-by-step guidance with AI coaching and feedback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
