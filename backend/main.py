from fastapi import FastAPI, Depends, HTTPException
import httpx
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from loguru import logger

from .database import database, crud
from . import schemas
from .logging_config import setup_logging
from .external_api.llm import llm_factory, GEMINI_FLASH, MISTRAL_LARGE, MISTRAL_SMALL, generate_description
from .external_api.prompt_builder import build_system_prompt


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
async def create_character_endpoint(character: schemas.CharacterCreate, db: Session = Depends(database.get_db)):
    logger.info(f"Creating character with name: {character.name}")
    character_data = character.dict()

    # Generate description if it's missing
    if not character_data.get('description'):
        logger.info("Description is missing, generating a new one...")
        generated_description = await generate_description(character_data)
        character_data['description'] = generated_description

    # Form tags
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
    models = [GEMINI_FLASH, MISTRAL_LARGE, MISTRAL_SMALL]
    logger.debug(f"Returning AI models: {models}")
    return models

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the Genana Backend!"}


@app.post("/api/chat/{character_id}", response_model=schemas.ChatResponse)
async def chat_with_character_endpoint(
    character_id: str, 
    request: schemas.ChatRequest, 
    db: Session = Depends(database.get_db)
):
    logger.info(f"Received chat request for character_id: {character_id}")

    # 1. Fetch Character
    db_character = crud.get_character(db, character_id=character_id)
    if not db_character:
        logger.error(f"Character with id {character_id} not found.")
        raise HTTPException(status_code=404, detail="Character not found")

    # 2. Fetch Chat History
    history_db = crud.get_chat_messages_by_character(db, character_id=character_id, limit=20) # Get last 20 messages
    history_for_prompt = [{"role": msg.role, "content": msg.content} for msg in history_db]

    # 3. Build System Prompt
    system_prompt = build_system_prompt(db_character)

    # 4. Get LLM Client from Factory
    try:
        llm_client = llm_factory.get_client(db_character.ai_model)
    except (ValueError, KeyError) as e:
        logger.error(f"Failed to get LLM client for model {db_character.ai_model}: {e}")
        raise HTTPException(status_code=500, detail=f"Unsupported or invalid AI model configured for character: {db_character.ai_model}")

    # 5. Generate LLM Response
    try:
        llm_response_content = await llm_client.generate_text(
            system_prompt=system_prompt,
            user_message=request.message,
            history=history_for_prompt
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            logger.warning(f"Rate limit exceeded for model {db_character.ai_model}. Details: {e.response.text}")
            raise HTTPException(status_code=429, detail="API rate limit exceeded. Please try again later or check your plan.")
        else:
            logger.error(f"HTTP error during text generation with {db_character.ai_model}: {e}")
            raise HTTPException(status_code=e.response.status_code, detail="An external API error occurred.")
    except Exception as e:
        logger.error(f"An unexpected error occurred during text generation with {db_character.ai_model}: {e}")
        raise HTTPException(status_code=500, detail="An unexpected internal error occurred.")

    # 6. Save messages to DB
    user_message_db = crud.create_chat_message(db, message_data={
        "character_id": character_id,
        "role": "user",
        "content": request.message
    })
    assistant_message_db = crud.create_chat_message(db, message_data={
        "character_id": character_id,
        "role": "assistant",
        "content": llm_response_content
    })

    logger.info(f"Successfully generated response for character {character_id}")
    
    return schemas.ChatResponse(
        response=llm_response_content,
        character_id=character_id,
        message_id=assistant_message_db.id
    )


