import { use } from "react"
import { ChatClientPage } from "./client-page"
import { ApiPlaceholder } from "@/components/ui/api-placeholder"
import { apiService } from "@/lib/api"

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { character } = use(apiService.getCharacter(id))

  if (!character) {
    return <ApiPlaceholder
      title="Персонаж не найден"
      description="Не удалось найти персонажа с таким ID. Возможно, он был удален или вы перешли по неверной ссылке."
      isError={true}
    />
  }

  return <ChatClientPage character={character} />
}
