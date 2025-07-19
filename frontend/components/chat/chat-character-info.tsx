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
          <div className="flex flex-wrap gap-2 mt-1">
            {character.tags?.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={
                  index === 0
                    ? "bg-brand-100 text-brand-700 text-xs"
                    : "bg-accent-100 text-accent-700 text-xs"
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
