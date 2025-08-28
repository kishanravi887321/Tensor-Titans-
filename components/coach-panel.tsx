"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"
import { MessageCircle, X, ChevronRight, Lightbulb, Zap, Send, HelpCircle, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoachMessage {
  id: string
  type: "welcome" | "suggestion" | "tip" | "encouragement" | "help" | "progress"
  title: string
  message: string
  icon: string
  action?: string
  actionUrl?: string
  timestamp: Date
}

export function CoachPanel() {
  const pathname = usePathname()
  const { coachOpen, setCoachOpen, currentRole, progress } = useAppStore()
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Generate contextual messages based on current page and progress
  useEffect(() => {
    const generateContextualMessages = () => {
      const newMessages: CoachMessage[] = []
      const completedLessons = progress.filter((p) => p.completed).length
      const currentRoleData = ROLES.find((r) => r.id === currentRole)

      // Welcome message for new users
      if (completedLessons === 0) {
        newMessages.push({
          id: "welcome",
          type: "welcome",
          title: "Welcome to Saskin!",
          message:
            "I'm your AI learning coach. I'll help you master AI tools for your role with personalized tips and feedback.",
          icon: "👋",
          timestamp: new Date(),
        })
      }

      // Role-specific guidance
      if (currentRole && currentRoleData) {
        newMessages.push({
          id: "role-guidance",
          type: "suggestion",
          title: `${currentRoleData.label} Focus`,
          message: `Great choice! ${currentRoleData.label} professionals can save hours daily with AI. Let's start with the fundamentals.`,
          icon: "🎯",
          action: "View Learning Path",
          actionUrl: `/learn/${currentRole}`,
          timestamp: new Date(),
        })
      }

      // Page-specific coaching
      if (pathname.includes("/lesson/")) {
        newMessages.push({
          id: "lesson-tip",
          type: "tip",
          title: "Lesson Pro Tip",
          message:
            "Try different prompt variations! The best way to learn AI is through experimentation. Don't be afraid to iterate.",
          icon: "💡",
          timestamp: new Date(),
        })
      } else if (pathname.includes("/learn/")) {
        newMessages.push({
          id: "learning-path-tip",
          type: "tip",
          title: "Learning Strategy",
          message:
            "Start with shorter lessons to build confidence, then tackle the hands-on projects for real-world practice.",
          icon: "📚",
          timestamp: new Date(),
        })
      } else if (pathname === "/dashboard") {
        if (completedLessons > 0) {
          newMessages.push({
            id: "progress-encouragement",
            type: "encouragement",
            title: "Great Progress!",
            message: `You've completed ${completedLessons} lessons! Keep up the momentum - consistency is key to mastering AI.`,
            icon: "🚀",
            timestamp: new Date(),
          })
        }
      }

      // Progress milestones
      if (completedLessons === 1) {
        newMessages.push({
          id: "first-lesson",
          type: "encouragement",
          title: "First Lesson Complete!",
          message:
            "Excellent start! You're already on your way to becoming more productive with AI. Ready for the next challenge?",
          icon: "🎉",
          timestamp: new Date(),
        })
      } else if (completedLessons === 5) {
        newMessages.push({
          id: "milestone-5",
          type: "encouragement",
          title: "5 Lessons Down!",
          message:
            "You're building real AI skills! Consider applying what you've learned to a real work task this week.",
          icon: "⭐",
          timestamp: new Date(),
        })
      }

      setMessages(newMessages)
    }

    generateContextualMessages()
  }, [pathname, currentRole, progress])

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    // Add user message
    const userMessage: CoachMessage = {
      id: `user-${Date.now()}`,
      type: "help",
      title: "You",
      message: chatInput,
      icon: "👤",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: CoachMessage = {
        id: `ai-${Date.now()}`,
        type: "help",
        title: "AI Coach",
        message: generateAIResponse(chatInput),
        icon: "🤖",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("help") || lowerInput.includes("stuck")) {
      return "I'm here to help! Try breaking down your prompt into smaller, specific parts. What exactly do you want the AI to do? The more specific you are, the better the results."
    } else if (lowerInput.includes("prompt") || lowerInput.includes("write")) {
      return "Great question about prompting! Remember the key elements: be specific, provide context, and clearly state your desired outcome. Would you like me to review a specific prompt you're working on?"
    } else if (lowerInput.includes("role") || lowerInput.includes("switch")) {
      return "You can switch roles anytime from the role switcher in the top navigation. Each role has tailored lessons for your specific use cases. What role are you most interested in exploring?"
    } else {
      return "That's a thoughtful question! Keep experimenting and practicing - that's how you'll build confidence with AI tools. Is there a specific lesson or concept you'd like help with?"
    }
  }

  const handleQuickAction = (action: string) => {
    const quickResponses: Record<string, CoachMessage> = {
      "get-hint": {
        id: `hint-${Date.now()}`,
        type: "tip",
        title: "Quick Hint",
        message:
          "Try being more specific in your prompt. Instead of 'write an email', try 'write a professional follow-up email to a client about project delays, maintaining a positive tone'.",
        icon: "💡",
        timestamp: new Date(),
      },
      "best-practices": {
        id: `practices-${Date.now()}`,
        type: "tip",
        title: "Best Practices",
        message:
          "1. Be specific about your goal\n2. Provide relevant context\n3. Specify the format you want\n4. Include your target audience\n5. Iterate and refine",
        icon: "📋",
        timestamp: new Date(),
      },
      motivation: {
        id: `motivation-${Date.now()}`,
        type: "encouragement",
        title: "You've Got This!",
        message:
          "Learning AI is a journey, not a destination. Every prompt you write makes you better. Keep experimenting and stay curious!",
        icon: "🌟",
        timestamp: new Date(),
      },
    }

    if (quickResponses[action]) {
      setMessages((prev) => [...prev, quickResponses[action]])
    }
  }

  if (!coachOpen) {
    return (
      <Button
        onClick={() => setCoachOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 lg:hidden"
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Coach</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setCoachOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card
              key={message.id}
              className={cn(
                "transition-all duration-300",
                index === messages.length - 1 && "animate-in slide-in-from-right-2",
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-base">{message.icon}</span>
                  {message.title}
                  {message.type === "tip" && (
                    <Badge variant="secondary" className="text-xs">
                      Tip
                    </Badge>
                  )}
                  {message.type === "encouragement" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Encouragement
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{message.message}</p>
                {message.action && message.actionUrl && (
                  <Button size="sm" className="w-full" asChild>
                    <a href={message.actionUrl}>
                      {message.action}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {isTyping && (
            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="text-sm text-muted-foreground ml-2">AI Coach is typing...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Help
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => handleQuickAction("get-hint")}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Get a Hint
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => handleQuickAction("best-practices")}
              >
                <Target className="h-4 w-4 mr-2" />
                Best Practices
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => handleQuickAction("motivation")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Need Motivation?
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!chatInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Ask about prompts, lessons, or get personalized tips
        </p>
      </div>
    </div>
  )
}
