export interface Character {
  // From backend schema
  id: string
  name: string
  role: string
  description?: string
  avatarUrl?: string
  tags?: string[]
  
  // General Info
  format?: string
  targetAudience?: string
  language?: string
  customLanguage?: string

  // Behavior
  personalityType?: string
  characterTraits?: string[]
  communicationTone?: string
  initiativeLevel?: string

  // Language Style
  formality?: string
  languageComplexity?: string
  useEmoji?: string
  typicalPhrases?: string[]

  // Scenario
  mainTasks?: string[]
  contextMemory?: string

  // Restrictions
  contentFilter?: boolean | string
  forbiddenTopics?: string[]
  behaviorLimits?: string

  // Timestamps
  createdAt: string // Assuming it will be serialized to string
  updatedAt?: string // Assuming it will be serialized to string

  // Fields that might be added on the frontend or are legacy
  // Making them optional to avoid breaking components that might still use them
  avatar?: string // Potentially derived from avatarUrl
  rating?: number
  chats?: number
}
