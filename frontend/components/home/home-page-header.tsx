import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export function HomePageHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 md:h-8 md:w-8 text-brand-600" />
          <span className="text-xl md:text-2xl font-bold text-gradient-brand">AI Characters</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/characters" className="text-gray-600 hover:text-brand-600 transition-colors">
            Персонажи
          </Link>
          <Link href="/generator" className="text-gray-600 hover:text-brand-600 transition-colors">
            Генератор
          </Link>
        </nav>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}
