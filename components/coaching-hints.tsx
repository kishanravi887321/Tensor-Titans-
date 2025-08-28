"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Role } from "@/types/models"
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

interface CoachingHintsProps {
  role: Role
  context?: string
}

const ROLE_HINTS = {
  marketing: [
    {
      title: "Use the AIDA Framework",
      description: "Structure your prompts with Attention, Interest, Desire, Action for compelling copy",
      example: "Create ad copy that grabs attention with a bold headline, builds interest with benefits...",
    },
    {
      title: "Specify Your Audience",
      description: "Always include target audience details for more relevant messaging",
      example: "Write for busy small business owners who value efficiency and cost savings...",
    },
    {
      title: "Include Brand Voice",
      description: "Describe the tone and personality you want in your content",
      example: "Use a friendly, professional tone that builds trust without being overly casual...",
    },
  ],
  hr: [
    {
      title: "Lead with Empathy",
      description: "Frame communications considering employee emotions and concerns",
      example: "Acknowledge the impact of changes and show understanding of employee perspectives...",
    },
    {
      title: "Be Clear and Transparent",
      description: "Use simple language and explain the 'why' behind policies",
      example: "Explain policy changes with clear reasoning and implementation timelines...",
    },
    {
      title: "Provide Next Steps",
      description: "Always include actionable next steps and support resources",
      example: "Include who to contact, when changes take effect, and where to find more info...",
    },
  ],
  ops: [
    {
      title: "Think in Systems",
      description: "Break complex processes into clear, repeatable steps",
      example: "Document each step with inputs, outputs, and quality checkpoints...",
    },
    {
      title: "Include Error Handling",
      description: "Anticipate what could go wrong and plan for contingencies",
      example: "Add 'if this, then that' scenarios for common issues and exceptions...",
    },
    {
      title: "Measure Success",
      description: "Define clear metrics and success criteria for processes",
      example: "Include KPIs, time targets, and quality standards for each process step...",
    },
  ],
  support: [
    {
      title: "Match Customer Emotion",
      description: "Adjust your tone to match and address the customer's emotional state",
      example: "For frustrated customers, acknowledge their feelings before providing solutions...",
    },
    {
      title: "Solution-First Approach",
      description: "Lead with what you can do, not what you can't",
      example: "Start with 'Here's how I can help...' rather than explaining limitations...",
    },
    {
      title: "Follow Up Commitment",
      description: "Always include when and how you'll follow up",
      example: "I'll update you by [specific time] with [specific information]...",
    },
  ],
}

export function CoachingHints({ role, context }: CoachingHintsProps) {
  const [expanded, setExpanded] = useState(false)
  const hints = ROLE_HINTS[role] || []

  if (hints.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Coaching Hints
            <Badge variant="secondary" className="text-xs">
              {role}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {hints.map((hint, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm">{hint.title}</h4>
              <p className="text-xs text-muted-foreground">{hint.description}</p>
              <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded text-xs italic">"{hint.example}"</div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
