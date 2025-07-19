"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Message } from "@/types/message"
import type { Character } from "@/types/character"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatCharacterInfo } from "@/components/chat/chat-character-info"
import { ChatMessage } from "@/components/chat/chat-message"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { ChatInput } from "@/components/chat/chat-input"
import { apiService } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ChatClientPageProps {
  character: Character
}

export function ChatClientPage({ character }: ChatClientPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Fetch chat history on initial load
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true)
      const { success, messages: historyMessages, error } = await apiService.getChatHistory(character.id);
      if (success) {
        // Add the initial greeting if history is empty
        if (historyMessages.length === 0) {
            setMessages([
                {
                    id: "initial-greeting",
                    role: "assistant",
                    content: `Привет! Я ${character.name}, твой помощник! 😊 Готов к общению?`,
                    timestamp: new Date(),
                },
            ]);
        } else {
            setMessages(historyMessages.map(m => ({...m, timestamp: new Date(m.timestamp)})));
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка загрузки истории",
          description: `Не удалось загрузить историю чата: ${error}`,
        })
      }
      setIsLoadingHistory(false)
    };
    fetchHistory();
  }, [character.id, character.name, toast]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const result = await apiService.sendChatMessage(character.id, input)

    setIsTyping(false)

    if (result.success && result.data) {
      const assistantMessage: Message = {
        id: result.data.messageId,
        role: "assistant",
        content: result.data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка отправки сообщения",
        description: `Не удалось получить ответ от ${character.name}. Пожалуйста, попробуйте еще раз.`,
      })
      // Optional: remove the user's message if the API call fails
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      <ChatHeader character={character} />

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-brand-100 h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] flex flex-col">
          <ChatCharacterInfo character={character} />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-full">
                <TypingIndicator character={character} />
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} character={character} />
              ))
            )}

            {isTyping && <TypingIndicator character={character} />}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isTyping={isTyping}
            characterName={character.name}
          />
        </div>
      </div>
    </div>
  )
}