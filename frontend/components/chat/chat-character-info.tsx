import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/types/character"
import { LetterAvatar } from "@/components/ui/letter-avatar"

interface ChatCharacterInfoProps {
  character: Character
}

export function ChatCharacterInfo({ character }: ChatCharacterInfoProps) {
  return (
    <div className="p-4 border-b bg-gradient-to-r from-brand-50 to-accent-50">
      <div className="flex items-center gap-3">
        <LetterAvatar name={character.name} className="w-12 h-12" />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{character.name}</h2>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary" className="bg-brand-100 text-brand-700 text-xs">
              {character.personality}
            </Badge>
            <Badge variant="secondary" className="bg-accent-100 text-accent-700 text-xs">
              {character.tone}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-brand-200 text-brand-600 hover:bg-brand-50 bg-transparent"
          >
            ⭐ Оставить отзыв
          </Button>
        </div>
      </div>
    </div>
  )
}
