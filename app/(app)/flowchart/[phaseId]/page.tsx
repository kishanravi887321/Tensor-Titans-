"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Play,
  Lock,
  Trophy,
  Target,
  Brain,
  ArrowLeft,
  GitBranch,
  Home,
  Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/mock-data"

interface FlowchartNode {
  id: string
  title: string
  type: 'lesson' | 'milestone' | 'skill' | 'project' | 'start' | 'completion'
  status: 'completed' | 'current' | 'locked'
  duration?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  connections: string[]
  position: { x: number; y: number }
  shape: 'rectangle' | 'circle' | 'diamond' | 'hexagon' | 'star'
}

interface PhaseData {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'locked'
  progress: number
  estimatedWeeks: number
  skills: string[]
  lessons: {
    id: string
    title: string
    duration: string
    status: 'completed' | 'current' | 'locked'
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }[]
  milestones: string[]
  color: string
}

export default function ProfessionalFlowchartPage() {
  const params = useParams()
  const router = useRouter()
  const { currentRole } = useAppStore()
  const [phase, setPhase] = useState<PhaseData | null>(null)
  const [nodes, setNodes] = useState<FlowchartNode[]>([])

  const generateRoadmapPhases = (role: string): PhaseData[] => {
    const roadmaps = {
      marketing: [
        {
          id: 'foundation',
          title: '🚀 Foundation',
          description: 'AI fundamentals for marketing',
          status: 'completed' as const,
          progress: 100,
          estimatedWeeks: 2,
          skills: ['AI Basics', 'Content Strategy', 'Tool Selection'],
          lessons: [
            { id: '1', title: 'Marketing AI Overview', duration: '60 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '2', title: 'Content Creation Tools', duration: '90 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '3', title: 'AI Writing Fundamentals', duration: '120 min', status: 'completed' as const, difficulty: 'intermediate' as const }
          ],
          milestones: ['Set up AI tools', 'Create first AI content', 'Understand AI limitations'],
          color: 'from-green-400 to-green-600'
        },
        {
          id: 'optimization',
          title: '🎯 Optimization',
          description: 'Advanced AI content and campaign optimization',
          status: 'current' as const,
          progress: 70,
          estimatedWeeks: 3,
          skills: ['Campaign Optimization', 'A/B Testing', 'Performance Analysis'],
          lessons: [
            { id: '4', title: 'AI-Powered A/B Testing', duration: '75 min', status: 'completed' as const, difficulty: 'intermediate' as const },
            { id: '5', title: 'Content Optimization', duration: '90 min', status: 'current' as const, difficulty: 'intermediate' as const },
            { id: '6', title: 'Campaign Performance', duration: '60 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Optimize conversion rates', 'Improve engagement by 30%', 'Master A/B testing'],
          color: 'from-blue-400 to-blue-600'
        }
      ],
      ops: [
        {
          id: 'foundation',
          title: '⚙️ Foundation',
          description: 'AI fundamentals for operations',
          status: 'completed' as const,
          progress: 100,
          estimatedWeeks: 2,
          skills: ['Process Mapping', 'Automation Basics', 'Workflow Design'],
          lessons: [
            { id: '1', title: 'Operations AI Overview', duration: '60 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '2', title: 'Process Documentation', duration: '90 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '3', title: 'Automation Fundamentals', duration: '120 min', status: 'completed' as const, difficulty: 'intermediate' as const }
          ],
          milestones: ['Map current processes', 'Identify automation opportunities', 'Create first automated workflow'],
          color: 'from-green-400 to-green-600'
        },
        {
          id: 'optimization',
          title: '🎯 Optimization',
          description: 'Streamline and improve workflows',
          status: 'current' as const,
          progress: 70,
          estimatedWeeks: 3,
          skills: ['Workflow Optimization', 'Efficiency Analysis', 'Resource Management'],
          lessons: [
            { id: '4', title: 'Bottleneck Analysis', duration: '75 min', status: 'completed' as const, difficulty: 'intermediate' as const },
            { id: '5', title: 'Resource Optimization', duration: '90 min', status: 'current' as const, difficulty: 'intermediate' as const },
            { id: '6', title: 'Efficiency Metrics', duration: '60 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Improve efficiency by 25%', 'Reduce manual tasks by 50%', 'Optimize resource allocation'],
          color: 'from-blue-400 to-blue-600'
        }
      ]
    }

    return roadmaps[role as keyof typeof roadmaps] || roadmaps.marketing
  }

  useEffect(() => {
    const phaseId = params.phaseId as string
    const phases = generateRoadmapPhases(currentRole || 'marketing')
    const foundPhase = phases.find(p => p.id === phaseId)
    
    if (foundPhase) {
      setPhase(foundPhase)
      setNodes(generateProfessionalFlowchart(foundPhase))
    }
  }, [params.phaseId, currentRole])

  const generateProfessionalFlowchart = (phaseData: PhaseData): FlowchartNode[] => {
    const nodes: FlowchartNode[] = []
    
    // Vertical layout with proper card spacing
    const centerX = 600 // Center horizontally
    const startY = 150
    const spacing = 220 // Vertical spacing between cards
    
    let currentY = startY
    
    // Start node
    nodes.push({
      id: 'start',
      title: 'START PHASE',
      type: 'start',
      status: 'completed',
      connections: phaseData.lessons.length > 0 ? ['lesson-1'] : ['skill-check'],
      position: { x: centerX, y: currentY },
      shape: 'rectangle'
    })
    
    currentY += spacing

    // Lesson nodes vertically aligned
    phaseData.lessons.forEach((lesson, index) => {
      nodes.push({
        id: `lesson-${index + 1}`,
        title: lesson.title,
        type: 'lesson',
        status: lesson.status,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        connections: index < phaseData.lessons.length - 1 ? [`lesson-${index + 2}`] : ['skill-check'],
        position: { x: centerX, y: currentY },
        shape: 'rectangle'
      })
      currentY += spacing
    })

    // Skills checkpoint
    nodes.push({
      id: 'skill-check',
      title: 'Skills Assessment',
      type: 'skill',
      status: phaseData.lessons.every(l => l.status === 'completed') ? 'completed' : 'locked',
      connections: phaseData.milestones.length > 0 ? ['milestone-1'] : ['completion'],
      position: { x: centerX, y: currentY },
      shape: 'circle'
    })
    currentY += spacing

    // Milestone nodes vertically aligned
    phaseData.milestones.forEach((milestone, index) => {
      nodes.push({
        id: `milestone-${index + 1}`,
        title: milestone,
        type: 'milestone',
        status: index === 0 ? 'current' : 'locked',
        connections: index < phaseData.milestones.length - 1 ? [`milestone-${index + 2}`] : ['completion'],
        position: { x: centerX, y: currentY },
        shape: 'rectangle'
      })
      currentY += spacing
    })

    // Completion node
    nodes.push({
      id: 'completion',
      title: 'PHASE COMPLETE',
      type: 'completion',
      status: 'locked',
      connections: [],
      position: { x: centerX, y: currentY },
      shape: 'rectangle'
    })

    return nodes
  }

  // Clean vertical arrows
  const generateCleanPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const fromX = from.x
    const fromY = from.y + 100 // Bottom of card
    const toX = to.x
    const toY = to.y - 20     // Top of next card
    
    // Straight vertical line
    return `M ${fromX} ${fromY} L ${toX} ${toY}`
  }

  const renderProfessionalShape = (node: FlowchartNode) => {
    const statusStyles = {
      completed: {
        border: 'border-green-400 border-2',
        bg: 'bg-white',
        iconBg: 'bg-green-500',
        iconColor: 'text-white',
        button: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        buttonIcon: 'Trophy',
        buttonText: 'Review & Practice'
      },
      current: {
        border: 'border-blue-400 border-3 ring-4 ring-blue-200',
        bg: 'bg-white',
        iconBg: 'bg-blue-500',
        iconColor: 'text-white',
        button: 'bg-blue-500 hover:bg-blue-600 text-white',
        buttonIcon: 'Play',
        buttonText: 'Start Now'
      },
      locked: {
        border: 'border-gray-300 border-2',
        bg: 'bg-gray-50',
        iconBg: 'bg-gray-400',
        iconColor: 'text-white',
        button: 'bg-gray-200 text-gray-500 cursor-not-allowed',
        buttonIcon: 'Lock',
        buttonText: 'Complete Prerequisites'
      }
    }

    const style = statusStyles[node.status]
    
    const getIcon = () => {
      const iconProps = { className: "w-5 h-5" }
      
      switch (node.status) {
        case 'completed': return <CheckCircle2 {...iconProps} />
        case 'current': return <Play {...iconProps} />
        case 'locked': return <Lock {...iconProps} />
        default: return <Circle {...iconProps} />
      }
    }

    const getButtonIcon = () => {
      const iconProps = { className: "w-4 h-4 mr-2" }
      
      switch (node.status) {
        case 'completed': return <Trophy {...iconProps} />
        case 'current': return <Play {...iconProps} />
        case 'locked': return <Lock {...iconProps} />
        default: return <Circle {...iconProps} />
      }
    }

    const getDifficultyColor = (difficulty?: string) => {
      switch (difficulty) {
        case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
        case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-600 border-gray-200'
      }
    }

    if (node.shape === 'circle') {
      // Skills assessment - circular design
      return (
        <div className={cn(
          "w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-105",
          style.border,
          style.bg
        )}>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", style.iconBg, style.iconColor)}>
            <Brain className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-center px-2 text-gray-700">
            Skill
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            Assessment
          </div>
        </div>
      )
    }

    // Card-based design for lessons and milestones
    return (
      <Card className={cn(
        "w-80 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer",
        style.border,
        style.bg
      )}>
        <CardContent className="p-6">
          {/* Header with icon and type */}
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
              style.iconBg,
              style.iconColor
            )}>
              {getIcon()}
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm capitalize font-semibold",
                node.type === 'lesson' && "bg-blue-50 text-blue-700 border-blue-300",
                node.type === 'milestone' && "bg-purple-50 text-purple-700 border-purple-300",
                node.type === 'skill' && "bg-green-50 text-green-700 border-green-300",
                node.type === 'start' && "bg-gray-50 text-gray-700 border-gray-300",
                node.type === 'completion' && "bg-yellow-50 text-yellow-700 border-yellow-300"
              )}
            >
              {node.type === 'start' ? 'Start' : 
               node.type === 'completion' ? 'Complete' : 
               node.type}
            </Badge>
          </div>
          
          {/* Title */}
          <h4 className="font-bold text-lg mb-3 leading-tight text-gray-800">
            {node.title}
          </h4>
          
          {/* Duration and Difficulty */}
          <div className="flex items-center justify-between text-sm mb-4">
            {node.duration && (
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {node.duration}
              </span>
            )}
            {node.difficulty && (
              <Badge className={getDifficultyColor(node.difficulty)} variant="outline">
                {node.difficulty}
              </Badge>
            )}
          </div>
          
          {/* Action Button */}
          <Button 
            size="lg" 
            className={cn("w-full font-semibold", style.button)}
            disabled={node.status === 'locked'}
          >
            {getButtonIcon()}
            {style.buttonText}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!phase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Loading flowchart...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Professional Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/roadmap')}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Home className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn("w-4 h-4 rounded-full", `bg-gradient-to-r ${phase.color}`)} />
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                {phase.title} - Learning Flow
              </h1>
              <Badge variant="secondary" className="ml-2">
                {phase.status === 'completed' ? 'Completed' : 
                 phase.status === 'current' ? 'In Progress' : 'Upcoming'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              {phase.estimatedWeeks} weeks • {phase.lessons.length} lessons
            </div>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              <Maximize2 className="w-3 h-3 mr-1" />
              Professional View
            </Badge>
          </div>
        </div>
      </div>

      {/* Vertical Scrollable Flowchart Area */}
      <div className="relative overflow-y-auto pt-20 pb-16 px-8 h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="min-h-full relative flex flex-col items-center" style={{ minHeight: '1400px' }}>
          {/* Professional SVG connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {nodes.map((node) =>
              node.connections.map((connectionId) => {
                const targetNode = nodes.find(n => n.id === connectionId)
                if (!targetNode) return null
                
                return (
                  <g key={`${node.id}-${connectionId}`}>
                    <path
                      d={generateCleanPath(node.position, targetNode.position)}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#professionalArrow)"
                      className="drop-shadow-sm"
                    />
                  </g>
                )
              })
            )}
            
            {/* Professional arrow marker */}
            <defs>
              <marker
                id="professionalArrow"
                markerWidth="10"
                markerHeight="8"
                refX="9"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M0,0 L0,8 L10,4 z"
                  fill="#3b82f6"
                />
              </marker>
            </defs>
          </svg>

          {/* Professional Card Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="relative z-10 mb-8"
              style={{
                transform: `translateY(${node.position.y - 150}px)` // Center cards properly
              }}
            >
              {renderProfessionalShape(node)}
            </div>
          ))}
        </div>

        {/* Minimal Legend */}
        <Card className="fixed bottom-8 left-8 z-10 bg-slate-800/90 backdrop-blur border-slate-600">
          <CardContent className="p-4">
            <h5 className="font-semibold text-sm mb-3 text-white">Status</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span className="text-slate-300">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-slate-300">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-400"></div>
                <span className="text-slate-300">Locked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Panel */}
        <Card className="fixed bottom-8 right-8 z-10 bg-slate-800/90 backdrop-blur border-slate-600 max-w-xs">
          <CardContent className="p-4">
            <h5 className="font-semibold text-sm mb-3 text-white flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Phase Skills
            </h5>
            <div className="flex flex-wrap gap-1">
              {phase.skills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="text-xs bg-slate-700 text-slate-200 border-slate-600"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
