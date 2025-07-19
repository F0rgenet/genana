from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime

class CharacterBase(BaseModel):
    # General Info
    name: str
    role: str
    ai_model: str
    format: Optional[str] = None
    target_audience: Optional[str] = None
    language: Optional[str] = None
    custom_language: Optional[str] = None

    # Behavior
    personality_type: Optional[str] = None
    character_traits: Optional[List[str]] = []
    communication_tone: Optional[str] = None
    initiative_level: Optional[str] = None

    # Language Style
    formality: Optional[str] = None
    language_complexity: Optional[str] = None
    use_emoji: Optional[str] = None
    typical_phrases: Optional[List[str]] = []

    # Scenario
    main_tasks: Optional[List[str]] = []
    context_memory: Optional[str] = None

    # Restrictions
    content_filter: Optional[Union[bool, str]] = False
    forbidden_topics: Optional[List[str]] = []
    behavior_limits: Optional[str] = None

    # Frontend-specific fields
    avatar_url: Optional[str] = None
    tags: Optional[List[str]] = []
    description: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: str
    character_id: str
    datetime: datetime

    class Config:
        orm_mode = True


class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: str
    character_id: str
    created_at: datetime

    class Config:
        orm_mode = True

# New schemas for the chat endpoint
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    character_id: str
    message_id: str