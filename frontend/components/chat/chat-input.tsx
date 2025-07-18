import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  handleSend: () => void
  isTyping: boolean
  characterName: string
}

export function ChatInput({ input, setInput, handleSend, isTyping, characterName }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Напишите сообщение ${characterName}...`}
          className="flex-1 border-brand-200 focus:border-brand-400"
          disabled={isTyping}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-gradient-brand hover:bg-gradient-brand-hover"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
