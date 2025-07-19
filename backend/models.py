from pydantic import BaseModel
from typing import List, Optional

class CharacterCreateRequest(BaseModel):
    name: str
    role: str
    format: str = "chat"
    targetAudience: str = "general"
    language: str = "russian"
    customLanguage: Optional[str] = None
    personalityType: str = "friendly"
    characterTraits: List[str] = []
    communicationTone: str = "casual"
    initiativeLevel: str = "balanced"
    formality: str = "casual"
    languageComplexity: str = "medium"
    useEmoji: str = "sometimes"
    typicalPhrases: List[str] = []
    mainTasks: List[str] = []
    contextMemory: str = "medium"
    contentFilter: str = "moderate"
    forbiddenTopics: List[str] = []
    behaviorLimits: str = "Быть полезным"
    description: str = "Помощный персонаж"

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


