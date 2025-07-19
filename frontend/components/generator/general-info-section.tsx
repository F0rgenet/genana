import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function GeneralInfoSection({ formData, handleInputChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            1
          </span>
          Общая информация
        </CardTitle>
        <CardDescription>Основные данные о персонаже</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Имя персонажа *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Например: Анна"
            />
          </div>
          <div>
            <Label htmlFor="role">Роль и назначение *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Например: помощник по обучению"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="format">Формат</Label>
          <Select value={formData.format} onValueChange={(value) => handleInputChange("format", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите формат" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="telegram-bot">Чат-бот в Telegram</SelectItem>
              <SelectItem value="ai-visual">AI-персонаж с визуалом</SelectItem>
              <SelectItem value="web-chat">Веб-чат</SelectItem>
              <SelectItem value="voice-assistant">Голосовой помощник</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetAudience">Целевая аудитория</Label>
          <Textarea
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange("targetAudience", e.target.value)}
            placeholder="Опишите возраст, уровень знаний, ожидания..."
          />
        </div>

        <div className="md:col-span-2"> 
          <Label htmlFor="description">Описание внешности   персонажа</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Краткое описание внешности персонажа"
            rows={3}
          />
        </div>

        <div>
          <Label>Язык общения</Label>
          <RadioGroup value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="russian" id="russian" />
              <Label htmlFor="russian">Русский</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english">Английский</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Другой</Label>
            </div>
          </RadioGroup>

          {formData.language === "other" && (
            <div className="mt-3">
              <Label htmlFor="customLanguage">Укажите язык</Label>
              <Input
                id="customLanguage"
                value={formData.customLanguage || ""}
                onChange={(e) => handleInputChange("customLanguage", e.target.value)}
                placeholder="Например: Французский, Немецкий, Испанский..."
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
