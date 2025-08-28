"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PROMPT_TEMPLATES } from "@/lib/mock-data"
import type { Role } from "@/types/models"
import { Copy, Wand2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromptEditorProps {
  role: Role
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
}

export function PromptEditor({ role, value, onChange, onSubmit, isLoading }: PromptEditorProps) {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = PROMPT_TEMPLATES[role] || []
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length
  const charCount = value.length

  const handleTemplateSelect = (template: string) => {
    onChange(template)
    setSelectedTemplate(null)
    toast({
      title: "Template applied",
      description: "You can now customize the prompt for your specific needs.",
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard.",
    })
  }

  const handleClear = () => {
    onChange("")
    toast({
      title: "Prompt cleared",
      description: "You can start fresh or use a template.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Prompt Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Templates */}
        {templates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.template)}
                  className="text-xs"
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Your Prompt</label>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!value}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!value}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your AI prompt here... Be specific about what you want to achieve."
            className="min-h-32 resize-none"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {wordCount} words • {charCount} characters
            </span>
            <div className="flex gap-2">
              {wordCount < 10 && <Badge variant="outline">Too short</Badge>}
              {wordCount >= 10 && wordCount <= 50 && <Badge variant="secondary">Good length</Badge>}
              {wordCount > 50 && <Badge variant="outline">Consider shortening</Badge>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={onSubmit} disabled={!value.trim() || isLoading} className="w-full">
          {isLoading ? "Generating..." : "Try Prompt"}
        </Button>
      </CardContent>
    </Card>
  )
}
