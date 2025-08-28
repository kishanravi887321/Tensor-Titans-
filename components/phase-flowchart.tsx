"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Play,
  Lock,
  Trophy,
  Target,
  Zap,
  Brain,
  X,
  GitBranch
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowchartNode {
  id: string
  title: string
  type: 'lesson' | 'milestone' | 'skill' | 'project'
  status: 'completed' | 'current' | 'locked'
  duration?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  connections: string[]
  position: { x: number; y: number }
}

interface PhaseFlowchartProps {
  phase: {
    id: string
    title: string
    lessons: any[]
    skills: string[]
    milestones: string[]
    color: string
    status: 'completed' | 'current' | 'locked'
    estimatedWeeks: number
  }
  isOpen: boolean
  onClose: () => void
}

export function PhaseFlowchart({ phase, isOpen, onClose }: PhaseFlowchartProps) {
  const generateFlowchartNodes = (): FlowchartNode[] => {
    const nodes: FlowchartNode[] = []
    const containerWidth = window.innerWidth - 100
    const containerHeight = window.innerHeight - 200
    
    // Calculate positions more dynamically
    const startX = 150
    const startY = 100
    const lessonSpacing = Math.min(300, (containerWidth - 300) / Math.max(phase.lessons.length, 1))
    
    // Start node
    nodes.push({
      id: 'start',
      title: 'Start Phase',
      type: 'milestone',
      status: 'completed',
      connections: phase.lessons.length > 0 ? ['lesson-1'] : ['skill-check'],
      position: { x: startX, y: startY }
    })

    // Lesson nodes in a flowing path
    phase.lessons.forEach((lesson, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = startX + 250 + (col * lessonSpacing)
      const y = startY + 150 + (row * 200)
      
      nodes.push({
        id: `lesson-${index + 1}`,
        title: lesson.title,
        type: 'lesson',
        status: lesson.status,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        connections: index < phase.lessons.length - 1 ? [`lesson-${index + 2}`] : ['skill-check'],
        position: { x, y }
      })
    })

    // Skill checkpoint
    const skillY = startY + 150 + (Math.floor((phase.lessons.length - 1) / 3) + 1) * 200
    nodes.push({
      id: 'skill-check',
      title: 'Skills Assessment',
      type: 'skill',
      status: phase.lessons.every(l => l.status === 'completed') ? 'completed' : 'locked',
      connections: phase.milestones.length > 0 ? ['milestone-1'] : ['completion'],
      position: { x: startX + 250, y: skillY }
    })

    // Milestone nodes
    phase.milestones.forEach((milestone, index) => {
      nodes.push({
        id: `milestone-${index + 1}`,
        title: milestone,
        type: 'milestone',
        status: index === 0 ? 'current' : 'locked',
        connections: index < phase.milestones.length - 1 ? [`milestone-${index + 2}`] : ['completion'],
        position: { x: startX + 500 + (index * 250), y: skillY + 150 }
      })
    })

    // Completion node
    nodes.push({
      id: 'completion',
      title: 'Phase Complete!',
      type: 'milestone',
      status: 'locked',
      connections: [],
      position: { x: startX + 500 + (phase.milestones.length * 250), y: skillY + 300 }
    })

    return nodes
  }

  const nodes = generateFlowchartNodes()

  const getNodeIcon = (node: FlowchartNode) => {
    switch (node.type) {
      case 'lesson':
        return <BookOpen className="w-5 h-5" />
      case 'milestone':
        return <Target className="w-5 h-5" />
      case 'skill':
        return <Brain className="w-5 h-5" />
      case 'project':
        return <Trophy className="w-5 h-5" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500'
      case 'current':
        return 'bg-blue-500 text-white border-blue-500'
      case 'locked':
        return 'bg-gray-300 text-gray-600 border-gray-300'
      default:
        return 'bg-gray-300 text-gray-600 border-gray-300'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Improved SVG path generator for smooth connections
  const generatePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const fromX = from.x + 120 // Card width
    const fromY = from.y + 40  // Card center
    const toX = to.x
    const toY = to.y + 40
    
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    
    // Create a curved path
    return `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${midY} Q ${midX} ${toY} ${toX} ${toY}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 m-0 border-0 bg-slate-900">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full", `bg-gradient-to-r ${phase.color}`)} />
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                {phase.title} - Learning Flow
              </DialogTitle>
              <Badge variant="secondary" className="ml-2">
                {phase.status === 'completed' ? 'Completed' : 
                 phase.status === 'current' ? 'In Progress' : 'Upcoming'}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                {phase.estimatedWeeks} weeks • {phase.lessons.length} lessons
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Flowchart Area */}
          <div className="flex-1 relative overflow-auto bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {nodes.map((node) =>
                node.connections.map((connectionId) => {
                  const targetNode = nodes.find(n => n.id === connectionId)
                  if (!targetNode) return null
                  
                  return (
                    <path
                      key={`${node.id}-${connectionId}`}
                      d={generatePath(node.position, targetNode.position)}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      className="drop-shadow-lg"
                    />
                  )
                })
              )}
              
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="12"
                  markerHeight="8"
                  refX="10"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#3b82f6"
                  />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute transition-transform hover:scale-105"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  zIndex: 2
                }}
              >
                <Card className={cn(
                  "w-56 transition-all hover:shadow-2xl cursor-pointer border-2 bg-white/95 backdrop-blur",
                  node.status === 'current' && "ring-2 ring-blue-400 shadow-lg shadow-blue-500/50 transform scale-105",
                  node.status === 'completed' && "ring-2 ring-green-400 shadow-lg shadow-green-500/30",
                  node.status === 'locked' && "opacity-60"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-md",
                        getNodeColor(node.status)
                      )}>
                        {node.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : node.status === 'current' ? (
                          <Play className="w-4 h-4" />
                        ) : node.status === 'locked' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          getNodeIcon(node)
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs capitalize font-medium",
                          node.type === 'lesson' && "bg-blue-50 text-blue-700 border-blue-200",
                          node.type === 'milestone' && "bg-purple-50 text-purple-700 border-purple-200",
                          node.type === 'skill' && "bg-green-50 text-green-700 border-green-200"
                        )}
                      >
                        {node.type}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-3 leading-tight">
                      {node.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs mb-3">
                      {node.duration && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {node.duration}
                        </span>
                      )}
                      {node.difficulty && (
                        <Badge className={getDifficultyColor(node.difficulty)} variant="outline">
                          {node.difficulty}
                        </Badge>
                      )}
                    </div>
                    
                    {node.status === 'current' && (
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {node.status === 'completed' && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Trophy className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Legend */}
            <Card className="absolute bottom-6 left-6 z-10 bg-slate-800/95 backdrop-blur border-slate-600">
              <CardContent className="p-4">
                <h5 className="font-semibold text-sm mb-3 text-white">Legend</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-300">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-slate-300">Locked</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Summary */}
            <Card className="absolute bottom-6 right-6 z-10 bg-slate-800/95 backdrop-blur border-slate-600 max-w-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-sm mb-3 text-white flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Skills in this phase
                </h5>
                <div className="flex flex-wrap gap-2">
                  {phase.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs bg-slate-700 text-slate-200 border-slate-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
