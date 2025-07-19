import { Card, CardContent } from "@/components/ui/card"
import type { Character } from "@/types/character"
import { LetterAvatar } from "@/components/ui/letter-avatar"

interface TypingIndicatorProps {
  character: Character
}

export function TypingIndicator({ character }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 justify-start">
      <LetterAvatar name={character.name} className="w-8 h-8 mt-1" />
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
