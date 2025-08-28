"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DiffViewerProps {
  original: string
  suggested: string
  onApplySuggestion: () => void
}

export function DiffViewer({ original, suggested, onApplySuggestion }: DiffViewerProps) {
  const { toast } = useToast()

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} prompt has been copied to your clipboard.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Prompt Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Original Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Your Prompt</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(original, "Original")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm whitespace-pre-wrap">{original}</p>
            </div>
          </div>

          {/* Suggested Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">AI Suggestion</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(suggested, "Suggested")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm whitespace-pre-wrap">{suggested}</p>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-center pt-2">
          <Button onClick={onApplySuggestion} className="gap-2">
            Apply Suggestion
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
