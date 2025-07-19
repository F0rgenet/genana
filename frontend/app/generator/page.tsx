"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"; //
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bot, Sparkles, Save } from "lucide-react"
import { GeneralInfoSection } from "@/components/generator/general-info-section"
import { BehaviorSection } from "@/components/generator/behavior-section"
import { LanguageStyleSection } from "@/components/generator/language-style-section"
import { ScenarioSection } from "@/components/generator/scenario-section"
import { RestrictionsSection } from "@/components/generator/restrictions-section"
import { apiService } from "@/lib/api"

export default function GeneratorPage() {
  const [formData, setFormData] = useState({
    // Общая информация
    name: "",
    role: "",
    format: "",
    targetAudience: "",
    language: "russian",
    customLanguage: "",

    // Поведение и характер
    personalityType: "",
    characterTraits: [] as string[],
    communicationTone: "",
    initiativeLevel: "",

    // Язык и стиль
    formality: "",
    languageComplexity: "",
    useEmoji: "",
    typicalPhrases: [] as string[],

    // Сценарные функции
    mainTasks: [] as string[],
    contextMemory: "",

    // Ограничения
    contentFilter: "",
    forbiddenTopics: [] as string[],
    behaviorLimits: "",
  })

  const router = useRouter(); //

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const addPhrase = (phrase: string) => {
    if (phrase.trim()) {
      setFormData((prev) => ({
        ...prev,
        typicalPhrases: [...prev.typicalPhrases, phrase.trim()],
      }))
    }
  }

  const removePhrase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      typicalPhrases: prev.typicalPhrases.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    // @ts-ignore
    const response = await apiService.createCharacter(formData)
    if (response.success) {
      alert("Персонаж успешно создан! (симуляция)")
      // TODO: Redirect to the new character's page or character list
    } else {
      alert("Ошибка при создании персонажа.")
    }
    if (response.success && response.characterId) { //
      alert("Персонаж успешно создан!");
      // Редирект на страницу персонажей
      router.push("/characters");
    }
    //    
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                На главную
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-gradient-brand">Генератор персонажей</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-gradient-brand hover:bg-gradient-brand-hover">
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient-brand">Создание ИИ персонажа</h1>
          <p className="text-gray-600 text-lg">Заполните форму для создания уникального виртуального персонажа</p>
        </div>

        <div className="space-y-8">
          <GeneralInfoSection formData={formData} handleInputChange={handleInputChange} />
          <BehaviorSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
          />
          <LanguageStyleSection
            formData={formData}
            handleInputChange={handleInputChange}
            addPhrase={addPhrase}
            removePhrase={removePhrase}
          />
          <ScenarioSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
          />
          <RestrictionsSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
          />

          {/* Кнопки действий */}
          <div className="flex justify-center gap-4 pt-8">
            <Button size="lg" onClick={handleSave} className="bg-gradient-brand hover:bg-gradient-brand-hover">
              <Sparkles className="h-4 w-4 mr-2" />
              Создать персонажа
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
