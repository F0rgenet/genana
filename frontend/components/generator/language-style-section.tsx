import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageStyleSection({ formData, handleInputChange, addPhrase, removePhrase }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            3
          </span>
          Язык и стиль общения
        </CardTitle>
        <CardDescription>Настройте манеру речи и стилистические особенности</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Формальность</Label>
            <Select value={formData.formality} onValueChange={(value) => handleInputChange("formality", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите уровень" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informal">Неформальная</SelectItem>
                <SelectItem value="semi-formal">Полуформальная</SelectItem>
                <SelectItem value="formal">Официальная</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Сложность языка</Label>
            <Select
              value={formData.languageComplexity}
              onValueChange={(value) => handleInputChange("languageComplexity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сложность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Простой</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="expert">Экспертный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Использование эмодзи</Label>
            <Select value={formData.useEmoji} onValueChange={(value) => handleInputChange("useEmoji", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите вариант" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
                <SelectItem value="moderate">Умеренно</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Типичные фразы</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Добавить типичную фразу..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addPhrase((e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ""
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addPhrase(input.value)
                  input.value = ""
                }}
              >
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.typicalPhrases.map((phrase: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removePhrase(index)}
                >
                  {phrase} ×
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
