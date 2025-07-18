import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import type { Character } from "@/types/character"

interface TypingIndicatorProps {
  character: Character
}

export function TypingIndicator({ character }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarImage src={character.avatar || "/placeholder.svg"} alt={character.name} />
        <AvatarFallback className="bg-gradient-to-r from-brand-100 to-accent-100 text-sm">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
