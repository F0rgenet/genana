import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MoreVertical, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Character } from "@/types/character"
import { LetterAvatar } from "@/components/ui/letter-avatar"

interface ChatHeaderProps {
  character: Character
}

export function ChatHeader({ character }: ChatHeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/characters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />К персонажам
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <LetterAvatar name={character.name} />
            <div>
              <h1 className="font-semibold text-lg">{character.name}</h1>
              <p className="text-sm text-gray-500">{character.role}</p>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Настройки чата
            </DropdownMenuItem>
            <DropdownMenuItem>Очистить историю</DropdownMenuItem>
            <DropdownMenuItem>Экспорт чата</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
