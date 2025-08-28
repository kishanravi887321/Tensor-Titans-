"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { MOCK_LESSONS } from "@/lib/mock-data"
import { Clock, CheckCircle, ArrowLeft, Download, Upload, Target, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const projectId = params.id as string
  const { updateProgress } = useAppStore()

  const project = MOCK_LESSONS.find((l) => l.id === projectId && l.project)
  const [submission, setSubmission] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground mt-2">The requested project does not exist.</p>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!submission.trim()) {
      toast({
        title: "Submission required",
        description: "Please provide your project submission before continuing.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitted(true)
    updateProgress(project.id, true)
    toast({
      title: "Project submitted!",
      description: "Great work! Your project has been submitted for review.",
    })
  }

  const handleDownloadAssets = () => {
    toast({
      title: "Download not available",
      description: "Asset downloads are not available in the UI-only demo version.",
      variant: "destructive",
    })
  }

  // Mock project criteria based on role
  const getCriteria = () => {
    switch (project.role) {
      case "marketing":
        return [
          "Clear value proposition",
          "Target audience identification",
          "Compelling call-to-action",
          "Brand voice consistency",
          "Measurable objectives",
        ]
      case "hr":
        return [
          "Clear policy explanation",
          "Employee impact consideration",
          "Implementation timeline",
          "Support resources provided",
          "Professional tone maintained",
        ]
      case "ops":
        return [
          "Step-by-step process",
          "Quality checkpoints",
          "Error handling procedures",
          "Success metrics defined",
          "Automation opportunities identified",
        ]
      case "support":
        return [
          "Customer empathy demonstrated",
          "Clear solution provided",
          "Follow-up commitment",
          "Professional tone",
          "Issue resolution focus",
        ]
      default:
        return ["Clear objectives", "Well-structured approach", "Actionable outcomes"]
    }
  }

  const criteria = getCriteria()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Badge
              variant="outline"
              className="gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
            >
              <Target className="h-3 w-3" />
              Project
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {project.duration} min
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Project Details */}
        <div className="space-y-6">
          {/* Project Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Project Brief</CardTitle>
              <CardDescription>Your hands-on challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.brief}</p>
            </CardContent>
          </Card>

          {/* Success Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Success Criteria</CardTitle>
              <CardDescription>Your submission should include these elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criteria.map((criterion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{criterion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Assets
              </CardTitle>
              <CardDescription>Resources to help you complete this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Project Brief Template</p>
                  <p className="text-xs text-muted-foreground">Structured template to guide your work</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadAssets}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Sample Data</p>
                  <p className="text-xs text-muted-foreground">Example data for your project context</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadAssets}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills You'll Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Submission */}
        <div className="space-y-6">
          {/* Submission Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Your Submission
              </CardTitle>
              <CardDescription>
                {isSubmitted ? "Your project has been submitted" : "Submit your completed project work"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Paste your project work here... Include your strategy, implementation plan, key messages, or whatever the project requires."
                className="min-h-64 resize-none"
                disabled={isSubmitted}
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{submission.length} characters</span>
                <span>Minimum 200 characters recommended</span>
              </div>
              {!isSubmitted ? (
                <Button onClick={handleSubmit} className="w-full" disabled={submission.length < 50}>
                  Submit Project
                </Button>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Project submitted successfully!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Review (shown after submission) */}
          {isSubmitted && (
            <Card>
              <CardHeader>
                <CardTitle>AI Coach Review</CardTitle>
                <CardDescription>Feedback on your project submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Clear understanding of the project requirements
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Well-structured approach to the problem
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Practical and actionable solutions
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">Areas for improvement:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        Consider adding more specific metrics for success measurement
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        Include potential challenges and mitigation strategies
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium mb-2">Overall Score: 85/100</h4>
                    <p className="text-sm text-muted-foreground">
                      Excellent work! You've demonstrated strong understanding of {project.role} AI applications. Keep
                      practicing to refine your approach further.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
