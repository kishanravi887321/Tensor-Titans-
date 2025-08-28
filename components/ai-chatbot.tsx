"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Send, Map, Lightbulb, HelpCircle, ArrowRight, CheckCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  section: 'roadmap' | 'suggestions' | 'other'
  roadmapData?: RoadmapStep[]
}

interface RoadmapStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
  duration: string
  skills: string[]
  order: number
}

interface AIChatbotProps {
  isOpen: boolean
}

export function AIChatbot({ isOpen }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [activeSection, setActiveSection] = useState<'roadmap' | 'suggestions' | 'other'>('roadmap')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { currentRole } = useAppStore()
  const router = useRouter()

  const currentRoleData = ROLES.find(r => r.id === currentRole)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('ai-coach-messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hello! I'm your AI Coach. I'm here to help you with your ${currentRoleData?.label || 'learning'} journey. What would you like to explore today?`,
        timestamp: new Date(),
        section: 'roadmap'
      }
      setMessages([welcomeMessage])
    }
  }, [currentRoleData])

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem('ai-coach-messages', JSON.stringify(messages))
    }
  }, [messages])

  const generateRoadmap = (query: string, role: string): RoadmapStep[] => {
    const roadmaps = {
      marketing: [
        { id: '1', title: 'AI Copywriting Basics', description: 'Learn fundamentals of AI-assisted copywriting', status: 'completed' as const, duration: '1 week', skills: ['copywriting', 'prompting'], order: 1 },
        { id: '2', title: 'Advanced Campaign Creation', description: 'Create multi-channel campaigns with AI', status: 'current' as const, duration: '2 weeks', skills: ['campaigns', 'automation'], order: 2 },
        { id: '3', title: 'Analytics & Optimization', description: 'Use AI for campaign analysis and optimization', status: 'upcoming' as const, duration: '1 week', skills: ['analytics', 'optimization'], order: 3 },
        { id: '4', title: 'AI Marketing Strategy', description: 'Develop comprehensive AI marketing strategies', status: 'upcoming' as const, duration: '2 weeks', skills: ['strategy', 'planning'], order: 4 }
      ],
      hr: [
        { id: '1', title: 'AI Recruitment Tools', description: 'Master AI-powered candidate screening', status: 'completed' as const, duration: '1 week', skills: ['recruitment', 'screening'], order: 1 },
        { id: '2', title: 'Employee Communications', description: 'Create effective communications with AI', status: 'current' as const, duration: '2 weeks', skills: ['communication', 'engagement'], order: 2 },
        { id: '3', title: 'Performance Management', description: 'AI-assisted performance reviews and feedback', status: 'upcoming' as const, duration: '1 week', skills: ['performance', 'feedback'], order: 3 },
        { id: '4', title: 'HR Analytics', description: 'Leverage AI for workforce analytics', status: 'upcoming' as const, duration: '2 weeks', skills: ['analytics', 'insights'], order: 4 }
      ],
      ops: [
        { id: '1', title: 'Process Automation', description: 'Automate repetitive tasks with AI', status: 'completed' as const, duration: '1 week', skills: ['automation', 'efficiency'], order: 1 },
        { id: '2', title: 'Workflow Optimization', description: 'Optimize existing workflows using AI insights', status: 'current' as const, duration: '2 weeks', skills: ['optimization', 'workflows'], order: 2 },
        { id: '3', title: 'Predictive Analytics', description: 'Implement predictive models for operations', status: 'upcoming' as const, duration: '2 weeks', skills: ['analytics', 'prediction'], order: 3 },
        { id: '4', title: 'Strategic Planning', description: 'AI-driven strategic operations planning', status: 'upcoming' as const, duration: '1 week', skills: ['strategy', 'planning'], order: 4 }
      ],
      support: [
        { id: '1', title: 'AI Customer Service', description: 'Enhance customer interactions with AI', status: 'completed' as const, duration: '1 week', skills: ['customer-service', 'communication'], order: 1 },
        { id: '2', title: 'Knowledge Management', description: 'Build AI-powered knowledge bases', status: 'current' as const, duration: '2 weeks', skills: ['knowledge', 'documentation'], order: 2 },
        { id: '3', title: 'Sentiment Analysis', description: 'Analyze customer sentiment with AI', status: 'upcoming' as const, duration: '1 week', skills: ['sentiment', 'analysis'], order: 3 },
        { id: '4', title: 'Proactive Support', description: 'Implement predictive customer support', status: 'upcoming' as const, duration: '2 weeks', skills: ['prediction', 'proactive'], order: 4 }
      ]
    }

    return roadmaps[role as keyof typeof roadmaps] || roadmaps.marketing
  }

  const generateAIResponse = (query: string, section: string): { content: string, roadmapData?: RoadmapStep[] } => {
    const responses = {
      roadmap: {
        default: `Based on your ${currentRoleData?.label || 'current'} role, I've created a personalized learning roadmap for you. This path will take you from basics to advanced AI applications in your field.`,
        specific: `Here's your customized roadmap for "${query}". Each step builds on the previous one to ensure comprehensive learning.`
      },
      suggestions: {
        default: `Here are some personalized suggestions for your ${currentRoleData?.label || 'learning'} journey:
        
• Start with fundamentals if you're new to AI
• Focus on practical applications in your daily work
• Join our community for peer learning
• Practice with real-world projects`,
        specific: `For "${query}", I recommend:
        
• Begin with hands-on exercises
• Connect theory to your actual work challenges
• Set up a practice environment
• Track your progress regularly`
      },
      other: {
        default: `I'm here to help with any questions about AI, learning paths, or how to apply these skills in your work. Feel free to ask anything!`,
        specific: `Regarding "${query}" - I'd be happy to help! Let me provide some insights and next steps for you.`
      }
    }

    const sectionResponses = responses[section as keyof typeof responses]
    const content = query.trim() ? sectionResponses.specific : sectionResponses.default
    
    let roadmapData: RoadmapStep[] | undefined
    if (section === 'roadmap') {
      roadmapData = generateRoadmap(query, currentRole || 'marketing')
    }

    return { content, roadmapData }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      section: activeSection
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, activeSection)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        section: activeSection,
        roadmapData: aiResponse.roadmapData
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const RoadmapVisual = ({ steps }: { steps: RoadmapStep[] }) => (
    <div className="space-y-4 mt-4">
      <h4 className="font-semibold text-sm">Your Learning Roadmap</h4>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                step.status === 'completed' ? "bg-green-500 text-white" :
                step.status === 'current' ? "bg-blue-500 text-white" :
                "bg-gray-200 text-gray-600"
              )}>
                {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : step.order}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-200 mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className={cn(
                  "font-medium text-sm",
                  step.status === 'current' ? "text-blue-600" : ""
                )}>
                  {step.title}
                </h5>
                <Badge variant={
                  step.status === 'completed' ? 'default' :
                  step.status === 'current' ? 'secondary' : 'outline'
                } className="text-xs">
                  {step.duration}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
              <div className="flex flex-wrap gap-1">
                {step.skills.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/roadmap')}>
        <ExternalLink className="w-4 h-4 mr-2" />
        View Detailed Roadmap
      </Button>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-background border rounded-lg shadow-2xl z-[90] animate-in slide-in-from-bottom-4 duration-300">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-primary" />
            AI Coach
            <Badge variant="secondary" className="ml-auto">
              {currentRoleData?.label || 'General'}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as any)} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4">
            <TabsTrigger value="roadmap" className="text-xs">
              <Map className="w-3 h-3 mr-1" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">
              <Lightbulb className="w-3 h-3 mr-1" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs">
              <HelpCircle className="w-3 h-3 mr-1" />
              Help
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages
                  .filter(msg => msg.section === activeSection)
                  .map((message) => (
                  <div key={message.id} className={cn(
                    "flex gap-3",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}>
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      message.type === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.roadmapData && (
                        <RoadmapVisual steps={message.roadmapData} />
                      )}
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />
            
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask about ${activeSection}...`}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
