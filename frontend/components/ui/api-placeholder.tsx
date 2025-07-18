"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react"

interface ApiPlaceholderProps {
  title: string
  description: string
  isError?: boolean
}

export function ApiPlaceholder({ title, description, isError = false }: ApiPlaceholderProps) {
  const pathname = usePathname()
  const isNotOnHomePage = pathname !== "/"

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 max-w-md">{description}</p>
      <div className="flex gap-4 mt-6">
        {isNotOnHomePage && (
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        )}
        {isError && (
          <Link href="/generator">
            <Button className="bg-gradient-brand hover:bg-gradient-brand-hover">
              <Sparkles className="h-4 w-4 mr-2" />
              Создать персонажа
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
