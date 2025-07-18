import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export function ScenarioSection({ formData, handleInputChange, handleArrayChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            4
          </span>
          Сценарные функции
        </CardTitle>
        <CardDescription>Определите основные задачи и сценарии использования</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Основные задачи</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              "Приветствие новых пользователей",
              "Ответы на FAQ",
              "Помощь в обучении",
              "Консультации",
              "Напоминания",
              "Развлечение",
              "Техническая поддержка",
              "Продажи",
            ].map((task) => (
              <div key={task} className="flex items-center space-x-2">
                <Checkbox
                  id={task}
                  checked={formData.mainTasks.includes(task)}
                  onCheckedChange={(checked) => handleArrayChange("mainTasks", task, checked as boolean)}
                />
                <Label htmlFor={task} className="text-sm">
                  {task}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="contextMemory">Контекстная память</Label>
          <Textarea
            id="contextMemory"
            value={formData.contextMemory}
            onChange={(e) => handleInputChange("contextMemory", e.target.value)}
            placeholder="Что должен запоминать персонаж: имя, уровень, предыдущие диалоги..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
