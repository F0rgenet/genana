import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RestrictionsSection({ formData, handleInputChange, handleArrayChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            5
          </span>
          Ограничения и запреты
        </CardTitle>
        <CardDescription>Настройте фильтры контента и ограничения поведения</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Контент-фильтр</Label>
          <RadioGroup
            value={formData.contentFilter}
            onValueChange={(value) => handleInputChange("contentFilter", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="filter-yes" />
              <Label htmlFor="filter-yes">Включен</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="filter-no" />
              <Label htmlFor="filter-no">Отключен</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Запрещенные темы</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {[
              "Политика",
              "Секс",
              "Медицинские советы",
              "Финансовые советы",
              "Насилие",
              "Наркотики",
              "Азартные игры",
              "Личная информация",
            ].map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={topic}
                  checked={formData.forbiddenTopics.includes(topic)}
                  onCheckedChange={(checked) => handleArrayChange("forbiddenTopics", topic, checked as boolean)}
                />
                <Label htmlFor={topic} className="text-sm">
                  {topic}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="behaviorLimits">Ограничения поведения</Label>
          <Textarea
            id="behaviorLimits"
            value={formData.behaviorLimits}
            onChange={(e) => handleInputChange("behaviorLimits", e.target.value)}
            placeholder="Например: не должен поддерживать романтические связи, не дает советы за пределами тематики..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
