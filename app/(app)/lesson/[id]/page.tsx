"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PromptEditor } from "@/components/prompt-editor"
import { DiffViewer } from "@/components/diff-viewer"
import { CoachingHints } from "@/components/coaching-hints"
import { useAppStore } from "@/lib/store"
import { MOCK_LESSONS } from "@/lib/mock-data"
import type { CoachFeedback, LessonContext } from "@/types/models"
import { Clock, CheckCircle, ThumbsUp, ThumbsDown, ArrowLeft, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const lessonId = params.id as string
  const { updateProgress } = useAppStore()

  const lesson = MOCK_LESSONS.find((l) => l.id === lessonId)
  const [prompt, setPrompt] = useState("")
  const [context, setContext] = useState<LessonContext>({})
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDiff, setShowDiff] = useState(false)

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="text-muted-foreground mt-2">The requested lesson does not exist.</p>
      </div>
    )
  }

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/coach/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          role: lesson.role,
          context,
        }),
      })

      if (!response.ok) throw new Error("Failed to evaluate prompt")

      const result: CoachFeedback = await response.json()
      setFeedback(result)
      setShowDiff(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to evaluate your prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    if (feedback?.suggestion) {
      setPrompt(feedback.suggestion)
      setShowDiff(false)
      toast({
        title: "Suggestion applied",
        description: "The AI suggestion has been applied to your prompt editor.",
      })
    }
  }

  const handleRating = (rating: "yes" | "no") => {
    updateProgress(lesson.id, true, rating)
    toast({
      title: "Feedback recorded",
      description: "Thank you for your feedback! This helps improve the learning experience.",
    })
  }

  const handleComplete = () => {
    updateProgress(lesson.id, true)
    toast({
      title: "Lesson completed!",
      description: "Great job! You can now move on to the next lesson.",
    })
    router.push(`/learn/${lesson.role}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration} min
            </Badge>
          </div>
          <p className="text-muted-foreground">{lesson.description}</p>
        </div>
        <Button onClick={handleComplete} className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Mark Complete
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Brief & Context */}
        <div className="space-y-6">
          {/* Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Brief</CardTitle>
              <CardDescription>What you'll learn in this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{lesson.brief}</p>
            </CardContent>
          </Card>

          <CoachingHints role={lesson.role} context={JSON.stringify(context)} />

          {/* Context Inputs */}
          {lesson.contextInputs && lesson.contextInputs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Context Settings</CardTitle>
                <CardDescription>Customize the scenario for your prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.contextInputs.map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label className="text-sm font-medium">{input.label}</label>
                    {input.type === "select" && input.options ? (
                      <Select
                        value={context[input.id] || ""}
                        onValueChange={(value) => setContext({ ...context, [input.id]: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${input.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {input.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : input.type === "textarea" ? (
                      <Textarea
                        value={context[input.id] || ""}
                        onChange={(e) => setContext({ ...context, [input.id]: e.target.value })}
                        placeholder={input.placeholder}
                        className="min-h-20"
                      />
                    ) : (
                      <Input
                        value={context[input.id] || ""}
                        onChange={(e) => setContext({ ...context, [input.id]: e.target.value })}
                        placeholder={input.placeholder}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills You'll Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lesson.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Prompt Editor & Results */}
        <div className="space-y-6">
          {/* Prompt Editor */}
          <PromptEditor
            role={lesson.role}
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmitPrompt}
            isLoading={isLoading}
          />

          {/* AI Output */}
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle>AI Output</CardTitle>
                <CardDescription>Generated response based on your prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans">{feedback.aiOutput}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diff Viewer */}
          {showDiff && feedback && (
            <DiffViewer original={prompt} suggested={feedback.suggestion} onApplySuggestion={handleApplySuggestion} />
          )}

          {/* Feedback */}
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle>AI Coach Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* What went well */}
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">What went well:</h4>
                  <ul className="text-sm space-y-1">
                    {feedback.good.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for improvement */}
                {feedback.gaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">Areas for improvement:</h4>
                    <ul className="text-sm space-y-1">
                      {feedback.gaps.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Automation ideas */}
                <div>
                  <h4 className="font-medium mb-2">Automation ideas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.automation.map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating */}
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Was this prompt effective?</CardTitle>
                <CardDescription>Your feedback helps improve the learning experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleRating("yes")} className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Yes, helpful
                  </Button>
                  <Button variant="outline" onClick={() => handleRating("no")} className="gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Needs improvement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
