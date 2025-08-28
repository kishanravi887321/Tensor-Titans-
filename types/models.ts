export type Role = "marketing" | "hr" | "ops" | "support"

export interface Lesson {
  id: string
  role: Role
  title: string
  duration: number // minutes
  skills: string[]
  description: string
  project?: boolean
  brief?: string
  contextInputs?: ContextInput[]
}

export interface ContextInput {
  id: string
  label: string
  type: "select" | "text" | "textarea"
  options?: string[]
  placeholder?: string
}

export interface ProgressItem {
  lessonId: string
  completed: boolean
  rating?: "yes" | "no"
  completedAt?: Date
}

export interface Badge {
  id: string
  label: string
  description: string
  earned: boolean
  earnedAt?: Date
  icon: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  currentRole?: Role
  streak: number
  lastActivity?: Date
}

export interface CoachFeedback {
  good: string[]
  gaps: string[]
  suggestion: string
  automation: string[]
  aiOutput: string
}

export interface LessonContext {
  [key: string]: string
}
