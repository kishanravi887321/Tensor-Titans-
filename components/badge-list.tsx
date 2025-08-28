"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Award, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function BadgeList() {
  const { badges } = useAppStore()
  const earnedBadges = badges.filter((b) => b.earned)
  const unearnedBadges = badges.filter((b) => !b.earned)

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge) => (
              <Card
                key={badge.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-2xl">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{badge.label}</CardTitle>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    >
                      Earned
                    </Badge>
                    {badge.earnedAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Available Badges ({unearnedBadges.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unearnedBadges.map((badge) => (
            <Card key={badge.id} className={cn("opacity-60 hover:opacity-80 transition-opacity")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl grayscale">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{badge.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
