from sqlalchemy.orm import Session
from . import models
import uuid
from loguru import logger

# Вспомогательная функция для генерации ID
def generate_id():
    return str(uuid.uuid4())

# CRUD для Character
def create_character(db: Session, character_data: dict):
    logger.debug(f"Creating character with data: {character_data}")
    db_character = models.Character(id=generate_id(), **character_data)
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    logger.debug(f"Character created with ID: {db_character.id}")
    return db_character

def get_character(db: Session, character_id: str):
    logger.debug(f"Fetching character with ID: {character_id}")
    return db.query(models.Character).filter(models.Character.id == character_id).first()

def get_characters(db: Session, skip: int = 0, limit: int = 100):
    logger.debug(f"Fetching characters with skip: {skip}, limit: {limit}")
    return db.query(models.Character).offset(skip).limit(limit).all()

def update_character(db: Session, character_id: str, character_data: dict):
    logger.debug(f"Updating character with ID: {character_id} with data: {character_data}")
    db_character = get_character(db, character_id)
    if db_character:
        for key, value in character_data.items():
            setattr(db_character, key, value)
        db.commit()
        db.refresh(db_character)
        logger.debug(f"Character with ID: {character_id} updated.")
    else:
        logger.warning(f"Character with ID: {character_id} not found for update.")
    return db_character

def delete_character(db: Session, character_id: str):
    logger.debug(f"Deleting character with ID: {character_id}")
    db_character = get_character(db, character_id)
    if db_character:
        db.delete(db_character)
        db.commit()
        logger.debug(f"Character with ID: {character_id} deleted.")
    else:
        logger.warning(f"Character with ID: {character_id} not found for deletion.")
    return db_character

# CRUD для ChatMessage
def create_chat_message(db: Session, message_data: dict):
    logger.debug(f"Creating chat message with data: {message_data}")
    db_message = models.ChatMessage(id=generate_id(), **message_data)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    logger.debug(f"Chat message created with ID: {db_message.id}")
    return db_message

def get_chat_messages_by_character(db: Session, character_id: str, skip: int = 0, limit: int = 100):
    logger.debug(f"Fetching chat messages for character ID: {character_id} with skip: {skip}, limit: {limit}")
    return db.query(models.ChatMessage).filter(models.ChatMessage.character_id == character_id).offset(skip).limit(limit).all()

# CRUD для Review
def create_review(db: Session, review_data: dict):
    logger.debug(f"Creating review with data: {review_data}")
    db_review = models.Review(id=generate_id(), **review_data)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    logger.debug(f"Review created with ID: {db_review.id}")
    return db_review

def get_reviews_by_character(db: Session, character_id: str, skip: int = 0, limit: int = 100):
    logger.debug(f"Fetching reviews for character ID: {character_id} with skip: {skip}, limit: {limit}")
    return db.query(models.Review).filter(models.Review.character_id == character_id).offset(skip).limit(limit).all()
