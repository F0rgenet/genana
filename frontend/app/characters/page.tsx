// app/characters/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, ArrowLeft } from "lucide-react"
import { CharacterCard } from "@/components/characters/character-card"
import { RecommendedCharacterCard } from "@/components/characters/recommended-character-card"
import { AddCharacterModal } from "@/components/characters/add-character-modal"
import { apiService } from "@/lib/api"
import { ApiPlaceholder } from "@/components/ui/api-placeholder"

// Отключаем кэширование для актуальных данных
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CharactersPage() {
  // Загружаем данные с сервера
  const charactersRes = await apiService.getCharacters();
  const recommendedRes = await apiService.getRecommendedCharacter();

  // Обработка ошибок загрузки
  if (!charactersRes.success) {
    return (
      <ApiPlaceholder
        title="Не удалось загрузить персонажей"
        description="Произошла ошибка при загрузке данных. Попробуйте обновить страницу позже."
        isError={true}
      />
    )
  }

  const characters = charactersRes.characters || [];
  const recommendedCharacter = recommendedRes.character || null;

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Шапка страницы */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-gradient-brand">AI Characters</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddCharacterModal />
            <Link href="/generator">
              <Button variant="outline">Генератор</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок страницы */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-brand">
            Выберите персонажа
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Готовые ИИ персонажи с уникальными характерами и специализациями
          </p>
        </div>

        {/* Рекомендованный персонаж */}
        {recommendedCharacter && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                🌟 Рекомендуем для вас
              </h2>
              <p className="text-gray-600">
                Персонаж, идеально подходящий для начинающих пользователей
              </p>
            </div>
            <RecommendedCharacterCard character={recommendedCharacter} />
          </div>
        )}

        {/* Все персонажи */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Все персонажи
          </h2>
        </div>

        {/* Список персонажей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {characters.length > 0 ? (
            characters.map((character: any) => (
              <CharacterCard key={character.id} character={character} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 mb-4">Персонажи не найдены</p>
              <Link href="/generator">
                <Button className="bg-gradient-brand hover:bg-gradient-brand-hover">
                  Создать первого персонажа
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}