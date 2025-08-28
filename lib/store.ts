import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProfile, ProgressItem, Badge, Role } from "@/types/models"
import { MOCK_BADGES } from "./mock-data"

interface AppState {
  // User state
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void

  // Progress state
  progress: ProgressItem[]
  updateProgress: (lessonId: string, completed: boolean, rating?: "yes" | "no") => void

  // Badges state
  badges: Badge[]
  earnBadge: (badgeId: string) => void

  // UI state
  currentRole: Role | null
  setCurrentRole: (role: Role | null) => void

  // Coach panel state
  coachOpen: boolean
  setCoachOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Progress state
      progress: [],
      updateProgress: (lessonId, completed, rating) => {
        const { progress } = get()
        const existingIndex = progress.findIndex((p) => p.lessonId === lessonId)

        if (existingIndex >= 0) {
          const updated = [...progress]
          updated[existingIndex] = {
            ...updated[existingIndex],
            completed,
            rating,
            completedAt: completed ? new Date() : undefined,
          }
          set({ progress: updated })
        } else {
          set({
            progress: [
              ...progress,
              {
                lessonId,
                completed,
                rating,
                completedAt: completed ? new Date() : undefined,
              },
            ],
          })
        }

        // Check for badge achievements
        const { badges, earnBadge } = get()
        const completedLessons = get().progress.filter((p) => p.completed).length

        // First lesson badge
        if (completed && completedLessons === 1 && !badges.find((b) => b.id === "first-lesson")?.earned) {
          earnBadge("first-lesson")
        }

        // Role-specific badges
        if (completed && lessonId.startsWith("marketing-") && completedLessons >= 3) {
          earnBadge("marketing-apprentice")
        }
      },

      // Badges state
      badges: MOCK_BADGES,
      earnBadge: (badgeId) => {
        const { badges } = get()
        const updated = badges.map((badge) =>
          badge.id === badgeId ? { ...badge, earned: true, earnedAt: new Date() } : badge,
        )
        set({ badges: updated })
      },

      // UI state
      currentRole: null,
      setCurrentRole: (role) => set({ currentRole: role }),

      // Coach panel state
      coachOpen: true,
      setCoachOpen: (open) => set({ coachOpen: open }),
    }),
    {
      name: "saskin-storage",
      partialize: (state) => ({
        user: state.user,
        progress: state.progress,
        badges: state.badges,
        currentRole: state.currentRole,
      }),
    },
  ),
)
