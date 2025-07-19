import { characters, getCharacterById } from "@/lib/mock-data"

// Плейсхолдеры для будущих API запросов

export const API_ENDPOINTS = {
  // Персонажи
  GET_CHARACTERS: "/api/characters",
  GET_CHARACTER: (id: string) => `/api/characters/${id}`,
  CREATE_CHARACTER: "/api/characters",
  UPDATE_CHARACTER: (id: string) => `/api/characters/${id}`,
  DELETE_CHARACTER: (id: string) => `/api/characters/${id}`,

  // Чаты
  GET_CHAT_HISTORY: (characterId: string) => `/api/chats/${characterId}`,
  SEND_MESSAGE: "/api/chats/message",

  // Отзывы
  CREATE_REVIEW: "/api/reviews",
  GET_REVIEWS: (characterId: string) => `/api/reviews/${characterId}`,

  // Рекомендации
  GET_RECOMMENDED_CHARACTER: "/api/characters/recommended",
}

// Типы для API запросов
export interface CreateCharacterRequest {
  name: string
  role: string
  format: string
  targetAudience: string
  language: string
  customLanguage?: string
  personalityType: string
  characterTraits: string[]
  communicationTone: string
  initiativeLevel: string
  formality: string
  languageComplexity: string
  useEmoji: string
  typicalPhrases: string[]
  mainTasks: string[]
  contextMemory: string
  contentFilter: string
  forbiddenTopics: string[]
  behaviorLimits: string
  description?: string
}

export interface SendMessageRequest {
  characterId: string
  message: string
  userId?: string
  history?: Array<{role: string, content: string}>
}

export interface CreateReviewRequest {
  characterId: string
  rating: number
  comment: string
  userId?: string
}

// // Функции-плейсхолдеры для API вызовов
// export const apiService = {
//   // Получение списка персонажей
//   async getCharacters() {
//     // TODO: Реализовать API запрос
//     console.log("API Call: Get Characters")
//     return {
//       success: true,
//       characters: characters,
//     }
//   },

//   // Получение одного персонажа
//   async getCharacter(id: string) {
//     // TODO: Реализовать API запрос
//     console.log("API Call: Get Character", id)
//     const character = getCharacterById(id)
//     if (character) {
//       return { success: true, character }
//     }
//     return { success: false, character: null }
//   },

//   // Создание персонажа
//   async createCharacter(data: CreateCharacterRequest) {
//     // TODO: Реализовать API запрос
//     console.log("API Call: Create Character", data)
//     return { success: true, characterId: "generated-id" }
//   },

//   // Отправка сообщения
//   async sendMessage(data: SendMessageRequest) {
//     // TODO: Реализовать API запрос к ИИ
//     console.log("API Call: Send Message", data)
//     return {
//       success: true,
//       response: "Ответ от ИИ персонажа будет здесь после интеграции с API",
//     }
//   },

//   // Создание отзыва
//   async createReview(data: CreateReviewRequest) {
//     // TODO: Реализовать API запрос
//     console.log("API Call: Create Review", data)
//     return { success: true, reviewId: "generated-review-id" }
//   },

//   // Получение рекомендованного персонажа
//   async getRecommendedCharacter() {
//     // TODO: Реализовать API запрос с ML рекомендациями
//     console.log("API Call: Get Recommended Character")
//     // В мок-данных просто вернем первого персонажа
//     const character = getCharacterById("1")
//     return {
//       success: true,
//       character,
//     }
//   },
// }



const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiService = {
  // Получение списка персонажей
  async getCharacters() {
    try {
      const res = await fetch(`${API_URL}/characters`);
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API Error: getCharacters", error);
      return { success: false, characters: [] };
    }
  },

  // Получение одного персонажа
  async getCharacter(id: string) {
    try {
      const res = await fetch(`${API_URL}/characters/${id}`);
      if (!res.ok) throw new Error("Character not found");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`API Error: getCharacter(${id})`, error);
      return { success: false, character: null };
    }
  },

  // Создание персонажа
  async createCharacter(data: CreateCharacterRequest) {
    try {
      const res = await fetch(`${API_URL}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create character");
      }
      
      const responseData = await res.json();
      return { 
        success: true, 
        characterId: responseData.characterId || responseData.id
      };
    } catch (error) {
      console.error("API Error: createCharacter", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  // Отправка сообщения
  async sendMessage(data: SendMessageRequest) {
    try {
      const res = await fetch(
        `${API_URL}/chat/${data.characterId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: data.message,
            history: data.history || [],
          }),
        }
      );
      
      if (!res.ok) throw new Error("Failed to get response");
      return await res.json();
    } catch (error) {
      console.error("API Error: sendMessage", error);
      return {
        success: false,
        response: "Произошла ошибка при генерации ответа",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  // Получение рекомендованного персонажа
  async getRecommendedCharacter() {
    try {
      const res = await fetch(`${API_URL}/characters/recommended`);
      if (!res.ok) throw new Error("Failed to fetch recommended character");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API Error: getRecommendedCharacter", error);
      return {
        success: false,
        character: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
};