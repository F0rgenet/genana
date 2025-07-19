// Определяем базовый URL для API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Персонажи
  CHARACTERS: `${API_BASE_URL}/api/characters`,
  CHARACTER_BY_ID: (id: string) => `${API_BASE_URL}/api/characters/${id}`,
  RECOMMENDED_CHARACTER: `${API_BASE_URL}/api/characters/recommended`,
  // Модели ИИ
  AI_MODELS: `${API_BASE_URL}/api/ai-models`,
  // Чат
  CHAT: (id: string) => `${API_BASE_URL}/api/chat/${id}`,
};

// Типы для API запросов
export interface CreateCharacterRequest {
  name: string;
  role: string;
  format?: string;
  targetAudience?: string;
  language?: string;
  customLanguage?: string;
  personalityType?: string;
  characterTraits?: string[];
  communicationTone?: string;
  initiativeLevel?: string;
  formality?: string;
  languageComplexity?: string;
  useEmoji?: string;
  typicalPhrases?: string[];
  mainTasks?: string[];
  contextMemory?: string;
  contentFilter?: boolean;
  forbiddenTopics?: string[];
  behaviorLimits?: string;
  description?: string;
  tags?: string[];
}

// Вспомогательные функции для конвертации ключей
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const transformKeys = (obj: any, transformFn: (key: string) => string): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => transformKeys(v, transformFn));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = transformFn(key);
      acc[newKey] = transformKeys(obj[key], transformFn);
      return acc;
    }, {} as any);
  }
  return obj;
};

const transformKeysToSnakeCase = (obj: any) => transformKeys(obj, toSnakeCase);
const transformKeysToCamelCase = (obj: any) => transformKeys(obj, toCamelCase);


// Функции для API вызовов
export const apiService = {
  // Создание персонажа
  async createCharacter(data: CreateCharacterRequest) {
    const snakeCaseData = transformKeysToSnakeCase(data);
    try {
      const response = await fetch(API_ENDPOINTS.CHARACTERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snakeCaseData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
      const result = await response.json();
      return { success: true, character: transformKeysToCamelCase(result) };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Получение списка персонажей
  async getCharacters() {
    try {
      const response = await fetch(API_ENDPOINTS.CHARACTERS);
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData, characters: [] };
      }
      const result = await response.json();
      return { success: true, characters: transformKeysToCamelCase(result) };
    } catch (error) {
      return { success: false, error: (error as Error).message, characters: [] };
    }
  },

  // Получение рекомендованного персонажа
  async getRecommendedCharacter() {
     try {
      const response = await fetch(API_ENDPOINTS.RECOMMENDED_CHARACTER);
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData, character: null };
      }
      const result = await response.json();
      return { success: true, character: transformKeysToCamelCase(result) };
    } catch (error) {
      return { success: false, error: (error as Error).message, character: null };
    }
  },

  // Получение персонажа по ID
  async getCharacter(id: string) {
    try {
      const response = await fetch(API_ENDPOINTS.CHARACTER_BY_ID(id));
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData, character: null };
      }
      const result = await response.json();
      return { success: true, character: transformKeysToCamelCase(result) };
    } catch (error) {
      return { success: false, error: (error as Error).message, character: null };
    }
  },

  // Получение списка моделей ИИ
  async getAiModels() {
    try {
      const response = await fetch(API_ENDPOINTS.AI_MODELS);
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData, models: [] };
      }
      const result = await response.json();
      return { success: true, models: result };
    } catch (error) {
      return { success: false, error: (error as Error).message, models: [] };
    }
  },

  // Отправка сообщения в чат
  async sendChatMessage(id: string, message: string) {
    try {
      const response = await fetch(API_ENDPOINTS.CHAT(id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
      const result = await response.json();
      return { success: true, data: transformKeysToCamelCase(result) };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Получение истории чата (из данных персонажа)
  async getChatHistory(id: string) {
    const { success, character, error } = await this.getCharacter(id);
    if (success && character && character.chatMessages) {
      // Сообщения уже в camelCase благодаря transformKeysToCamelCase в getCharacter
      return { success: true, messages: character.chatMessages };
    }
    return { success: false, error: error || "Chat history not found", messages: [] };
  },
};

