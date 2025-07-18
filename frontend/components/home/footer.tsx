import { Bot } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t py-8 md:py-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="h-5 w-5 md:h-6 md:w-6 text-brand-600" />
          <span className="text-lg md:text-xl font-bold text-gray-800">AI Characters</span>
        </div>
        <p className="text-sm md:text-base">© 2024 AI Characters. Создавайте будущее общения с ИИ.</p>
      </div>
    </footer>
  )
}
