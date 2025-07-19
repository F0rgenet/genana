from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from loguru import logger

from .database import database, crud
from . import schemas
from .logging_config import setup_logging

setup_logging()

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Разрешаем все методы, включая OPTIONS
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logger.info("Starting up and creating database tables.")
    database.create_db_and_tables()

@app.post("/api/characters", response_model=schemas.Character)
def create_character_endpoint(character: schemas.CharacterCreate, db: Session = Depends(database.get_db)):
    logger.info(f"Creating character with name: {character.name}")
    character_data = character.dict()

    # Формируем теги
    tags = []
    if character.character_traits and len(character.character_traits) > 0:
        tags.append(character.character_traits[0])
    if character.main_tasks and len(character.main_tasks) > 0:
        tags.append(character.main_tasks[0])
    character_data['tags'] = tags

    if 'content_filter' in character_data and isinstance(character_data['content_filter'], str):
        character_data['content_filter'] = character_data['content_filter'].lower() in ['true', 'yes', '1']
    
    db_character = crud.create_character(db=db, character_data=character_data)
    logger.info(f"Character {db_character.name} created with ID: {db_character.id}")
    return db_character

@app.get("/api/characters", response_model=List[schemas.Character])
def get_characters_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    logger.info(f"Fetching characters with skip: {skip} and limit: {limit}")
    characters = crud.get_characters(db, skip=skip, limit=limit)
    logger.debug(f"Found {len(characters)} characters.")
    return characters

@app.get("/api/characters/recommended", response_model=schemas.Character)
def get_recommended_character_endpoint(db: Session = Depends(database.get_db)):
    logger.info("Fetching recommended character.")
    # Временная реализация: возвращаем первого персонажа или 404
    character = crud.get_characters(db, limit=1)
    if not character:
        logger.warning("No characters found to recommend.")
        raise HTTPException(status_code=404, detail="No characters found")
    logger.info(f"Recommending character with ID: {character[0].id}")
    return character[0]


@app.get("/api/characters/{character_id}", response_model=schemas.Character)
def get_character_endpoint(character_id: str, db: Session = Depends(database.get_db)):
    logger.info(f"Fetching character with id: {character_id}")
    db_character = crud.get_character(db, character_id=character_id)
    if db_character is None:
        logger.warning(f"Character with id {character_id} not found")
        raise HTTPException(status_code=404, detail="Character not found")
    logger.debug(f"Found character with id {character_id}")
    return db_character

@app.get("/api/ai-models", response_model=List[str])
def get_ai_models_endpoint():
    logger.info("Fetching available AI models.")
    # Временная реализация: возвращаем статичный список моделей
    models = ["Gen-AI-4o", "Gen-AI-4o-mini"]
    logger.debug(f"Returning AI models: {models}")
    return models

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the Genana Backend!"}

