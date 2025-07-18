import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function BehaviorSection({ formData, handleInputChange, handleArrayChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-accent-100 text-accent-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            2
          </span>
          Поведение и характер
        </CardTitle>
        <CardDescription>Определите личность и стиль поведения персонажа</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="personalityType">Тип личности</Label>
          <Select
            value={formData.personalityType}
            onValueChange={(value) => handleInputChange("personalityType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип личности" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENFP">ENFP - Вдохновитель</SelectItem>
              <SelectItem value="ENTP">ENTP - Полемист</SelectItem>
              <SelectItem value="INFJ">INFJ - Защитник</SelectItem>
              <SelectItem value="INTJ">INTJ - Архитектор</SelectItem>
              <SelectItem value="ENFJ">ENFJ - Тренер</SelectItem>
              <SelectItem value="ENTJ">ENTJ - Командир</SelectItem>
              <SelectItem value="ISFP">ISFP - Художник</SelectItem>
              <SelectItem value="ISTP">ISTP - Мастер</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Ключевые черты характера</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {[
              "Дружелюбный",
              "Саркастичный",
              "Эмпатичный",
              "Энергичный",
              "Спокойный",
              "Креативный",
              "Аналитический",
              "Поддерживающий",
              "Мотивирующий",
            ].map((trait) => (
              <div key={trait} className="flex items-center space-x-2">
                <Checkbox
                  id={trait}
                  checked={formData.characterTraits.includes(trait)}
                  onCheckedChange={(checked) => handleArrayChange("characterTraits", trait, checked as boolean)}
                />
                <Label htmlFor={trait} className="text-sm">
                  {trait}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Тон общения</Label>
            <RadioGroup
              value={formData.communicationTone}
              onValueChange={(value) => handleInputChange("communicationTone", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly">Дружелюбный</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="formal" />
                <Label htmlFor="formal">Официальный</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ironic" id="ironic" />
                <Label htmlFor="ironic">Ироничный</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sarcastic" id="sarcastic" />
                <Label htmlFor="sarcastic">Саркастичный</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Уровень инициативности</Label>
            <RadioGroup
              value={formData.initiativeLevel}
              onValueChange={(value) => handleInputChange("initiativeLevel", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">Высокий</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Средний</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Низкий</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
