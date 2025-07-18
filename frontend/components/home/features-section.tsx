import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Zap, Shield } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 pb-12 md:pb-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20 px-4">
          <Card className="border-brand-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-brand-600 mb-4 mx-auto" />
              <CardTitle className="text-lg md:text-xl">Умные диалоги</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                Персонажи с уникальным стилем общения, памятью контекста и эмоциональным интеллектом
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-accent-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Zap className="h-10 w-10 md:h-12 md:w-12 text-accent-600 mb-4 mx-auto" />
              <CardTitle className="text-lg md:text-xl">Быстрая генерация</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                Создавайте персонажей за минуты с помощью интуитивного конструктора и ИИ-помощника
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-brand-100 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-10 w-10 md:h-12 md:w-12 text-brand-600 mb-4 mx-auto" />
              <CardTitle className="text-lg md:text-xl">Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                Встроенные фильтры контента и настройки приватности для безопасного общения
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
