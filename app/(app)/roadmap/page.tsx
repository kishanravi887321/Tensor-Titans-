"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { PhaseFlowchart } from "@/components/phase-flowchart"
import { useAppStore } from "@/lib/store"
import { ROLES, MOCK_LESSONS } from "@/lib/mock-data"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Play,
  Star,
  TrendingUp,
  Calendar,
  Trophy,
  Zap,
  Users,
  Brain,
  Award,
  ChevronRight,
  Lock,
  Sparkles,
  GitBranch
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RoadmapPhase {
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

export default function RoadmapPage() {
  const { currentRole, progress } = useAppStore()
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [showFlowchart, setShowFlowchart] = useState(false)
  const [flowchartPhase, setFlowchartPhase] = useState<RoadmapPhase | null>(null)
  
  const currentRoleData = ROLES.find(r => r.id === currentRole)

  const generateRoadmapPhases = (role: string): RoadmapPhase[] => {
    const roadmaps = {
      marketing: [
        {
          id: 'foundation',
          title: '🎯 Foundation',
          description: 'Master AI fundamentals for marketing',
          status: 'completed' as const,
          progress: 100,
          estimatedWeeks: 2,
          skills: ['AI Basics', 'Prompt Engineering', 'Content Strategy'],
          lessons: [
            { id: '1', title: 'Introduction to AI Marketing', duration: '45 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '2', title: 'Effective Prompt Writing', duration: '60 min', status: 'completed' as const, difficulty: 'beginner' as const },
            { id: '3', title: 'Brand Voice with AI', duration: '90 min', status: 'completed' as const, difficulty: 'intermediate' as const }
          ],
          milestones: ['Complete AI fundamentals', 'Create first AI-generated content', 'Establish brand guidelines'],
          color: 'from-green-400 to-green-600'
        },
        {
          id: 'content',
          title: '✍️ Content Mastery',
          description: 'Create compelling content across all channels',
          status: 'current' as const,
          progress: 65,
          estimatedWeeks: 3,
          skills: ['Copywriting', 'Social Media', 'Email Marketing', 'SEO'],
          lessons: [
            { id: '4', title: 'AI-Powered Copywriting', duration: '75 min', status: 'completed' as const, difficulty: 'intermediate' as const },
            { id: '5', title: 'Social Media Content Creation', duration: '60 min', status: 'current' as const, difficulty: 'intermediate' as const },
            { id: '6', title: 'Email Campaign Optimization', duration: '90 min', status: 'locked' as const, difficulty: 'intermediate' as const },
            { id: '7', title: 'SEO Content Strategy', duration: '120 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Launch multi-channel campaign', 'Achieve 20% engagement increase', 'Master content personalization'],
          color: 'from-blue-400 to-blue-600'
        },
        {
          id: 'analytics',
          title: '📊 Analytics & Optimization',
          description: 'Measure, analyze, and optimize performance',
          status: 'locked' as const,
          progress: 0,
          estimatedWeeks: 2,
          skills: ['Data Analysis', 'A/B Testing', 'Performance Optimization', 'ROI Tracking'],
          lessons: [
            { id: '8', title: 'AI Analytics Dashboard', duration: '90 min', status: 'locked' as const, difficulty: 'intermediate' as const },
            { id: '9', title: 'Advanced A/B Testing', duration: '120 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '10', title: 'ROI Optimization Strategies', duration: '150 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Set up analytics tracking', 'Run successful A/B tests', 'Improve ROI by 30%'],
          color: 'from-purple-400 to-purple-600'
        },
        {
          id: 'mastery',
          title: '🚀 Strategic Mastery',
          description: 'Lead AI transformation in marketing',
          status: 'locked' as const,
          progress: 0,
          estimatedWeeks: 4,
          skills: ['Strategy', 'Leadership', 'Innovation', 'Team Management'],
          lessons: [
            { id: '11', title: 'AI Marketing Strategy', duration: '180 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '12', title: 'Team AI Integration', duration: '120 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '13', title: 'Future-Proofing Marketing', duration: '90 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Develop AI strategy', 'Train team on AI tools', 'Become AI marketing expert'],
          color: 'from-orange-400 to-orange-600'
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
        },
        {
          id: 'analytics',
          title: '📈 Predictive Analytics',
          description: 'Forecast and predict operational needs',
          status: 'locked' as const,
          progress: 0,
          estimatedWeeks: 3,
          skills: ['Forecasting', 'Risk Assessment', 'Capacity Planning'],
          lessons: [
            { id: '7', title: 'Demand Forecasting', duration: '120 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '8', title: 'Risk Assessment Models', duration: '150 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '9', title: 'Capacity Planning', duration: '90 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Implement forecasting model', 'Reduce risks by 40%', 'Optimize capacity planning'],
          color: 'from-purple-400 to-purple-600'
        },
        {
          id: 'leadership',
          title: '👑 Operations Leadership',
          description: 'Lead operational transformation',
          status: 'locked' as const,
          progress: 0,
          estimatedWeeks: 4,
          skills: ['Strategic Planning', 'Change Management', 'Innovation'],
          lessons: [
            { id: '10', title: 'Strategic Operations Framework', duration: '180 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '11', title: 'Change Management', duration: '120 min', status: 'locked' as const, difficulty: 'advanced' as const },
            { id: '12', title: 'Innovation Pipeline', duration: '90 min', status: 'locked' as const, difficulty: 'advanced' as const }
          ],
          milestones: ['Develop ops strategy', 'Lead digital transformation', 'Become operations expert'],
          color: 'from-orange-400 to-orange-600'
        }
      ]
    }

    // Add similar structures for HR and Support roles
    return roadmaps[role as keyof typeof roadmaps] || roadmaps.marketing
  }

  const phases = generateRoadmapPhases(currentRole || 'marketing')
  const currentPhase = phases.find(p => p.status === 'current')
  const completedPhases = phases.filter(p => p.status === 'completed').length
  const totalPhases = phases.length
  const overallProgress = ((completedPhases + (currentPhase?.progress || 0) / 100) / totalPhases) * 100

  const handlePhaseClick = (phase: RoadmapPhase) => {
    setFlowchartPhase(phase)
    setShowFlowchart(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'current': return <Play className="w-5 h-5 text-blue-600" />
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Your {currentRoleData?.label} Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master AI tools and techniques with a structured, progressive learning path designed for {currentRoleData?.label.toLowerCase()} professionals
          </p>
          
          {/* Quick Access to Flowchart */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => {
                const availablePhase = phases.find(p => p.status !== 'locked') || phases[0]
                handlePhaseClick(availablePhase)
              }}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              View Interactive Learning Flow
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedPhases}</div>
                <div className="text-sm text-muted-foreground">Phases Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {phases.reduce((acc, phase) => acc + phase.lessons.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {phases.reduce((acc, phase) => acc + phase.estimatedWeeks, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Weeks to Master</div>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={overallProgress} className="h-3 bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Path Visualization */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Learning Journey</h2>
            <Badge variant="secondary" className="text-sm">
              Click any phase to explore detailed flowchart
            </Badge>
          </div>
          
          <div className="grid gap-6">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={cn(
                  "relative group transition-all duration-300",
                  phase.status !== 'locked' && "cursor-pointer"
                )}
                onClick={() => phase.status !== 'locked' && handlePhaseClick(phase)}
              >
                <Card 
                  className={cn(
                    "overflow-hidden transition-all duration-300 hover:shadow-xl border-2",
                    phase.status === 'current' ? 'border-blue-500 shadow-lg scale-105' : 
                    phase.status === 'completed' ? 'border-green-500' : 'border-gray-200',
                    phase.status === 'locked' && 'opacity-60',
                    phase.status !== 'locked' && "group-hover:scale-[1.02] group-hover:shadow-2xl"
                  )}
                >
                  <div className={cn("h-2 bg-gradient-to-r", phase.color)} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Phase Number & Status */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-transform group-hover:scale-110",
                          phase.status === 'completed' ? 'bg-green-500 text-white border-green-500' :
                          phase.status === 'current' ? 'bg-blue-500 text-white border-blue-500' :
                          'bg-gray-200 text-gray-500 border-gray-300'
                        )}>
                          {phase.status === 'completed' ? <Trophy className="w-8 h-8" /> : index + 1}
                        </div>
                        {index < phases.length - 1 && (
                          <div className="w-1 h-12 bg-gradient-to-b from-gray-300 to-transparent mt-4" />
                        )}
                      </div>

                      {/* Phase Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                              {phase.title}
                              {phase.status === 'current' && <Zap className="w-5 h-5 text-blue-500" />}
                              {phase.status !== 'locked' && (
                                <GitBranch className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              )}
                            </h3>
                            <p className="text-muted-foreground mt-1">{phase.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'current' ? 'secondary' : 'outline'}>
                              {phase.status === 'completed' ? 'Completed' : 
                               phase.status === 'current' ? 'In Progress' : 'Locked'}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {phase.estimatedWeeks} weeks
                            </div>
                          </div>
                        </div>

                      {/* Progress Bar */}
                      {(phase.status === 'current' || phase.status === 'completed') && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                      )}

                      {/* Skills */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Skills You'll Master:</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Lessons Preview */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Lessons ({phase.lessons.length})
                          </h4>
                          <div className="space-y-1">
                            {phase.lessons.slice(0, 3).map(lesson => (
                              <div key={lesson.id} className="flex items-center gap-2 text-sm">
                                {getStatusIcon(lesson.status)}
                                <span className={lesson.status === 'locked' ? 'text-gray-400' : ''}>{lesson.title}</span>
                                <Badge className={getDifficultyColor(lesson.difficulty)} variant="outline">
                                  {lesson.difficulty}
                                </Badge>
                              </div>
                            ))}
                            {phase.lessons.length > 3 && (
                              <div className="text-sm text-muted-foreground">
                                +{phase.lessons.length - 3} more lessons
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Key Milestones
                          </h4>
                          <div className="space-y-1">
                            {phase.milestones.slice(0, 3).map((milestone, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <Award className="w-3 h-3 text-yellow-500" />
                                <span>{milestone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex flex-wrap gap-3">
                        {phase.status === 'completed' && (
                          <>
                            <Button variant="outline" className="flex-1 min-w-[120px]">
                              <Trophy className="w-4 h-4 mr-2" />
                              Review & Practice
                            </Button>
                            <Button 
                              variant="secondary" 
                              className="flex-1 min-w-[120px]"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePhaseClick(phase)
                              }}
                            >
                              <GitBranch className="w-4 h-4 mr-2" />
                              View Flowchart
                            </Button>
                          </>
                        )}
                        {phase.status === 'current' && (
                          <>
                            <Button className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 min-w-[120px]"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePhaseClick(phase)
                              }}
                            >
                              <GitBranch className="w-4 h-4 mr-2" />
                              View Flowchart
                            </Button>
                          </>
                        )}
                        {phase.status === 'locked' && (
                          <Button variant="outline" disabled className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Previous Phase
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Achievement */}
        {completedPhases === totalPhases && (
          <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 mb-8">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-yellow-700 mb-2">Congratulations! 🎉</h2>
              <p className="text-lg text-yellow-600 mb-4">
                You've mastered the complete {currentRoleData?.label} AI learning path!
              </p>
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Star className="w-5 h-5 mr-2" />
                View Certificate
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interactive Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-dashed border-2 border-blue-200 mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Pro Tip</h3>
            </div>
            <p className="text-muted-foreground">
              Click on any phase card above to explore the detailed learning flowchart with interactive lessons, milestones, and skills progression.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                Interactive Flowchart
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Track Progress
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Skills Overview
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flowchart Dialog */}
        {flowchartPhase && (
          <PhaseFlowchart
            phase={flowchartPhase}
            isOpen={showFlowchart}
            onClose={() => setShowFlowchart(false)}
          />
        )}
      </div>
    </div>
  )
}
