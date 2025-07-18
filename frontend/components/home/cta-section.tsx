import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-gradient-brand text-white py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
          Готовы создать своего ИИ персонажа?
        </h2>
        <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
          Присоединяйтесь к тысячам пользователей, которые уже создали уникальных виртуальных помощников
        </p>
        <Link href="/generator">
          <Button size="lg" variant="secondary" className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
            Начать создание
          </Button>
        </Link>
      </div>
    </section>
  )
}
