import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Star } from "lucide-react"
import type { Character } from "@/types/character"

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-brand-100">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={character.avatar || "/placeholder.svg"} alt={character.name} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-brand-100 to-accent-100">
            {character.name[0]}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{character.name}</CardTitle>
        <CardDescription className="text-brand-600 font-medium">{character.role}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed h-20 overflow-hidden">{character.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-brand-100 text-brand-700">
            {character.personality}
          </Badge>
          <Badge variant="secondary" className="bg-accent-100 text-accent-700">
            {character.tone}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{character.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{character.chats} чатов</span>
          </div>
        </div>

        <Link href={`/chat/${character.id}`} className="block">
          <Button className="w-full bg-gradient-brand hover:bg-gradient-brand-hover">Начать чат</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
