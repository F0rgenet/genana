"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AddCharacterModalProps {
  onCharacterAdded?: () => void
}

export function AddCharacterModal({ onCharacterAdded }: AddCharacterModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    format: "chat",
    targetAudience: "general",
    language: "russian",
    customLanguage: "",
    personalityType: "friendly",
    characterTraits: [] as string[],
    communicationTone: "casual",
    initiativeLevel: "balanced",
    formality: "casual",
    languageComplexity: "medium",
    useEmoji: "sometimes",
    typicalPhrases: [] as string[],
    mainTasks: [] as string[],
    contextMemory: "medium",
    contentFilter: "moderate",
    forbiddenTopics: [] as string[],
    behaviorLimits: "Быть полезным и дружелюбным",
    description: "Помощный и дружелюбный персонаж"
  })

  const [newTrait, setNewTrait] = useState("")
  const [newPhrase, setNewPhrase] = useState("")
  const [newTask, setNewTask] = useState("")
  const [newForbiddenTopic, setNewForbiddenTopic] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof typeof formData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }))
    }
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Sending character data:", formData)
      const response = await apiService.createCharacter(formData)
      
      if (response.success) {
        toast({
          title: "Персонаж создан!",
          description: "Новый персонаж успешно добавлен в систему.",
        })
        setOpen(false)
        setFormData({
          name: "",
          role: "",
          format: "chat",
          targetAudience: "general",
          language: "russian",
          customLanguage: "",
          personalityType: "friendly",
          characterTraits: [],
          communicationTone: "casual",
          initiativeLevel: "balanced",
          formality: "casual",
          languageComplexity: "medium",
          useEmoji: "sometimes",
          typicalPhrases: [],
          mainTasks: [],
          contextMemory: "medium",
          contentFilter: "moderate",
          forbiddenTopics: [],
          behaviorLimits: "Быть полезным и дружелюбным",
          description: "Помощный и дружелюбный персонаж"
        })
        onCharacterAdded?.()
        router.refresh()
      } else {
        toast({
          title: "Ошибка",
          description: response.error || "Не удалось создать персонажа",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании персонажа",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-brand hover:bg-gradient-brand-hover">
          <Plus className="h-4 w-4 mr-2" />
          Добавить персонажа
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать нового персонажа</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового ИИ персонажа с уникальными характеристиками
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Основная информация</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Имя персонажа *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Введите имя персонажа"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Роль *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="Например: Помощник, Эксперт, Друг"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Краткое описание персонажа"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Характер и личность */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Характер и личность</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personalityType">Тип личности</Label>
                <Select value={formData.personalityType} onValueChange={(value) => handleInputChange("personalityType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Дружелюбный</SelectItem>
                    <SelectItem value="professional">Профессиональный</SelectItem>
                    <SelectItem value="creative">Креативный</SelectItem>
                    <SelectItem value="analytical">Аналитический</SelectItem>
                    <SelectItem value="humorous">Юмористический</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationTone">Тон общения</Label>
                <Select value={formData.communicationTone} onValueChange={(value) => handleInputChange("communicationTone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Неформальный</SelectItem>
                    <SelectItem value="formal">Формальный</SelectItem>
                    <SelectItem value="enthusiastic">Энтузиастичный</SelectItem>
                    <SelectItem value="calm">Спокойный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Черты характера</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  placeholder="Добавить черту характера"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addArrayItem("characterTraits", newTrait)
                      setNewTrait("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addArrayItem("characterTraits", newTrait)
                    setNewTrait("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.characterTraits.map((trait, index) => (
                  <Badge key={index} variant="secondary">
                    {trait}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("characterTraits", index)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Язык и стиль */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Язык и стиль</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Язык</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="russian">Русский</SelectItem>
                    <SelectItem value="english">Английский</SelectItem>
                    <SelectItem value="custom">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="languageComplexity">Сложность языка</Label>
                <Select value={formData.languageComplexity} onValueChange={(value) => handleInputChange("languageComplexity", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Простой</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="complex">Сложный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.language === "custom" && (
              <div>
                <Label htmlFor="customLanguage">Укажите язык</Label>
                <Input
                  id="customLanguage"
                  value={formData.customLanguage}
                  onChange={(e) => handleInputChange("customLanguage", e.target.value)}
                  placeholder="Например: Французский, Немецкий"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formality">Формальность</Label>
                <Select value={formData.formality} onValueChange={(value) => handleInputChange("formality", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Неформальный</SelectItem>
                    <SelectItem value="semi-formal">Полуформальный</SelectItem>
                    <SelectItem value="formal">Формальный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="useEmoji">Использование эмодзи</Label>
                <Select value={formData.useEmoji} onValueChange={(value) => handleInputChange("useEmoji", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Никогда</SelectItem>
                    <SelectItem value="sometimes">Иногда</SelectItem>
                    <SelectItem value="often">Часто</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Типичные фразы */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Типичные фразы</h3>
            <div className="flex gap-2">
              <Input
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="Добавить типичную фразу"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArrayItem("typicalPhrases", newPhrase)
                    setNewPhrase("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addArrayItem("typicalPhrases", newPhrase)
                  setNewPhrase("")
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.typicalPhrases.map((phrase, index) => (
                <Badge key={index} variant="secondary">
                  {phrase}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("typicalPhrases", index)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Основные задачи */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Основные задачи</h3>
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Добавить задачу"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArrayItem("mainTasks", newTask)
                    setNewTask("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addArrayItem("mainTasks", newTask)
                  setNewTask("")
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.mainTasks.map((task, index) => (
                <Badge key={index} variant="secondary">
                  {task}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("mainTasks", index)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Ограничения */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ограничения</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contentFilter">Фильтр контента</Label>
                <Select value={formData.contentFilter} onValueChange={(value) => handleInputChange("contentFilter", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Строгий</SelectItem>
                    <SelectItem value="moderate">Умеренный</SelectItem>
                    <SelectItem value="lenient">Либеральный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contextMemory">Память контекста</Label>
                <Select value={formData.contextMemory} onValueChange={(value) => handleInputChange("contextMemory", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Краткосрочная</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="long">Долгосрочная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Запрещенные темы</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newForbiddenTopic}
                  onChange={(e) => setNewForbiddenTopic(e.target.value)}
                  placeholder="Добавить запрещенную тему"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addArrayItem("forbiddenTopics", newForbiddenTopic)
                      setNewForbiddenTopic("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addArrayItem("forbiddenTopics", newForbiddenTopic)
                    setNewForbiddenTopic("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.forbiddenTopics.map((topic, index) => (
                  <Badge key={index} variant="destructive">
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("forbiddenTopics", index)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="behaviorLimits">Ограничения поведения</Label>
              <Textarea
                id="behaviorLimits"
                value={formData.behaviorLimits}
                onChange={(e) => handleInputChange("behaviorLimits", e.target.value)}
                placeholder="Дополнительные ограничения поведения персонажа"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать персонажа"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 