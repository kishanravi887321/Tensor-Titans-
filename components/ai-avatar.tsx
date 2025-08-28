"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAvatarProps {
  onToggleChat: () => void
  isOpen: boolean
  hasNewMessage?: boolean
}

export function AIAvatar({ onToggleChat, isOpen, hasNewMessage }: AIAvatarProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <Button
        onClick={onToggleChat}
        size="lg"
        className={cn(
          "relative h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl",
          isOpen ? "bg-muted hover:bg-muted/90" : "bg-primary hover:bg-primary/90",
          "ring-2 ring-background"
        )}
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <Bot className="h-7 w-7" />
        )}
        
        {hasNewMessage && !isOpen && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-red-500 animate-pulse">
            <span className="text-xs font-bold">!</span>
          </Badge>
        )}
      </Button>
      
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-xl text-sm whitespace-nowrap animate-in slide-in-from-bottom-2 duration-500 max-w-[200px]">
          <div className="font-medium">AI Coach</div>
          <div className="text-xs opacity-90">Click for personalized help!</div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-primary" />
        </div>
      )}
    </div>
  )
}
