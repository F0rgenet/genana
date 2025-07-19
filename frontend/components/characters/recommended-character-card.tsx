import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import type { Character } from "@/types/character"
import { LetterAvatar } from "@/components/ui/letter-avatar"

interface RecommendedCharacterCardProps {
  character: Character
}

export function RecommendedCharacterCard({ character }: RecommendedCharacterCardProps) {
  return (
    <Card className="max-w-2xl mx-auto border-2 border-brand-200 bg-gradient-to-r from-brand-50 to-accent-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <LetterAvatar name={character.name} className="w-24 h-24 md:w-32 md:h-32 text-3xl" />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold">{character.name}</h3>
              <Badge className="bg-brand-100 text-brand-700 w-fit mx-auto md:mx-0">{character.role}</Badge>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{character.description}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {character.tags?.[0] && (
                <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                  {character.tags[0]}
                </Badge>
              )}
              {character.tags?.[1] && (
                <Badge variant="secondary" className="bg-accent-100 text-accent-700">
                  {character.tags[1]}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                ⭐ {character.rating} рейтинг
              </Badge>
            </div>

            <Link href={`/chat/${character.id}`}>
              <Button size="lg" className="bg-gradient-brand hover:bg-gradient-brand-hover w-full md:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Начать общение
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
