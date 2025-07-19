from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    TIMESTAMP,
    Boolean,
    ForeignKey,
    JSON,
    func,
)
from sqlalchemy.orm import relationship
from .database import Base


class Character(Base):
    __tablename__ = "character"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())

    # General Info
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    ai_model = Column(String, nullable=False)
    format = Column(String)
    target_audience = Column(String)
    language = Column(String)
    custom_language = Column(String)

    # Behavior
    personality_type = Column(String)
    character_traits = Column(JSON)  # Stored as JSON array
    communication_tone = Column(String)
    initiative_level = Column(String)

    # Language Style
    formality = Column(String)
    language_complexity = Column(String)
    use_emoji = Column(String)
    typical_phrases = Column(JSON)  # Stored as JSON array

    # Scenario
    main_tasks = Column(JSON)  # Stored as JSON array
    context_memory = Column(String)

    # Restrictions
    content_filter = Column(Boolean)
    forbidden_topics = Column(JSON)  # Stored as JSON array
    behavior_limits = Column(String)

    # Frontend-specific fields
    avatar_url = Column(String)
    tags = Column(JSON)  # Stored as JSON array
    description = Column(String)

    # Relationships
    chat_messages = relationship("ChatMessage", back_populates="character")
    reviews = relationship("Review", back_populates="character")


class ChatMessage(Base):
    __tablename__ = "chat_message"

    id = Column(String, primary_key=True, index=True)
    character_id = Column(String, ForeignKey("character.id"))
    datetime = Column(TIMESTAMP, server_default=func.now())
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)

    # Relationship
    character = relationship("Character", back_populates="chat_messages")


class Review(Base):
    __tablename__ = "review"

    id = Column(String, primary_key=True, index=True)
    character_id = Column(String, ForeignKey("character.id"))
    created_at = Column(TIMESTAMP, server_default=func.now())
    rating = Column(Integer)  # 1 to 5
    comment = Column(Text)

    # Relationship
    character = relationship("Character", back_populates="reviews")
