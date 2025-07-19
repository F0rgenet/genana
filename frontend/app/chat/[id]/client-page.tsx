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

interface ChatClientPageProps {
  character: Character
}

export function ChatClientPage({ character }: ChatClientPageProps) {
  const backgroundStyle: React.CSSProperties | undefined = character.avatar
    ? {
        backgroundImage: `url(${character.avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Привет! Я ${character.name}, твой помощник! 😊 Готов к общению?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // const handleSend = async () => {
  //   if (!input.trim()) return

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     role: "user",
  //     content: input,
  //     timestamp: new Date(),
  //   }

  //   setMessages((prev) => [...prev, userMessage])
  //   setInput("")
  //   setIsTyping(true)

  //   // Симуляция ответа ИИ
  //   setTimeout(() => {
  //     const responses = [
  //       "Отличный вопрос! 🤔 Давай разберем это пошагово...",
  //       "Понимаю тебя! Это действительно важная тема. Вот что я думаю...",
  //       "Супер! 🎉 Ты задаешь правильные вопросы. Позволь объяснить...",
  //       "Хм, интересно! 💡 Я помогу тебе с этим разобраться...",
  //     ]

  //     const assistantMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       role: "assistant",
  //       content: responses[Math.floor(Math.random() * responses.length)],
  //       timestamp: new Date(),
  //     }

  //     setMessages((prev) => [...prev, assistantMessage])
  //     setIsTyping(false)
  //   }, 1500)
  // }

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    try {
      // Подготавливаем историю для отправки
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
  
      const response = await apiService.sendMessage({
        characterId: character.id,
        message: input,
        history
      });
  
      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Обработка ошибки
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Извините, произошла ошибка. Попробуйте задать вопрос еще раз.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-light"
      style={backgroundStyle}
    >
      <ChatHeader character={character} />

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-brand-100 h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] flex flex-col">
          <ChatCharacterInfo character={character} />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} character={character} />
            ))}

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
