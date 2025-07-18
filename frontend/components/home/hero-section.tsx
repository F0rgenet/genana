import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-gradient-brand">
          Создавайте уникальных ИИ персонажей
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Генерируйте персонализированных виртуальных помощников с уникальным характером, стилем общения и визуальным
          образом
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 px-4">
          <Link href="/generator">
            <Button
              size="lg"
              className="bg-gradient-brand hover:bg-gradient-brand-hover text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Создать персонажа
            </Button>
          </Link>
          <Link href="/characters">
            <Button
              size="lg"
              variant="outline"
              className="border-brand-200 text-brand-600 hover:bg-brand-light px-6 md:px-8 py-3 md:py-4 text-base md:text-lg bg-transparent w-full sm:w-auto"
            >
              <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Выбрать из готовых
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
