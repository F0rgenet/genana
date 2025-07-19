import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import type { Message } from "@/types/message"
import type { Character } from "@/types/character"
import { LetterAvatar } from "@/components/ui/letter-avatar"

interface ChatMessageProps {
  message: Message
  character: Character
}

export function ChatMessage({ message, character }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <LetterAvatar name={character.name} className="w-8 h-8 mt-1" />
      )}

      <div className={`max-w-[85%] md:max-w-[70%] ${isUser ? "order-first" : ""}`}>
        <Card
          className={`${
            isUser ? "bg-gradient-brand text-white border-brand-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </CardContent>
        </Card>
        <p className="text-xs text-gray-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-gradient-to-r from-gray-100 to-gray-200 text-sm">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
