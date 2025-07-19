from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import CharacterCreateRequest, ChatRequest
from chat_bot import BotFactory
import uuid
import config
import requests, base64



def generate_avatar(prompt: str) -> str:
    """Generate avatar image using Stability AI and return data URI string.

    If generation fails or API key is missing, returns empty string so that
    frontend can fall back to placeholder image.
    """
    api_key = config.STABILITY_API_KEY
    print(f"DEBUG: generate_avatar called with prompt: {prompt}")
    print(f"DEBUG: STABILITY_API_KEY present: {bool(api_key)}")
    
    if not api_key:
        print("DEBUG: No STABILITY_API_KEY, returning empty string")
        return ""

    try:
        # Translate Russian prompt to English for Stability AI
        english_prompt = translate_to_english(prompt)
        print(f"DEBUG: Translated prompt to English: {english_prompt}")
        
        print("DEBUG: Making request to Stability AI...")
        response = requests.post(
            "https://api.stability.ai/v2beta/stable-image/generate/ultra",
            headers={
                "authorization": f"Bearer {api_key}",
                "accept": "image/*"
            },
            files={"none": ''},
            data={
                "prompt": english_prompt,
                "output_format": "webp",
            },
        )
        
        print(f"DEBUG: Stability AI response status: {response.status_code}")
        
        if response.status_code == 200:
            # Convert image to base64 data URI
            image_data = base64.b64encode(response.content).decode('utf-8')
            data_uri = f"data:image/webp;base64,{image_data}"
            print(f"DEBUG: Generated avatar data length: {len(data_uri)}")
            return data_uri
        else:
            print(f"DEBUG: Stability AI error: {response.status_code} - {response.text}")
            return ""
            
    except Exception as e:
        print(f"DEBUG: Exception in generate_avatar: {e}")
        return ""


def translate_to_english(text: str) -> str:
    """Simple Russian to English translation for common avatar descriptions"""
    translations = {
        'кот': 'cat',
        'кошка': 'cat',
        'собака': 'dog',
        'девушка': 'girl',
        'девушка': 'woman',
        'парень': 'boy',
        'мужчина': 'man',
        'женщина': 'woman',
        'глаза': 'eyes',
        'волосы': 'hair',
        'светлые': 'blonde',
        'черные': 'black',
        'голубые': 'blue',
        'зеленые': 'green',
        'карие': 'brown',
        'большая': 'large',
        'грудь': 'chest',
        'ноги': 'legs',
        'длинные': 'long',
        'рога': 'horns',
        'вместо': 'instead of',
        'огромный': 'huge',
        'темная кожа': 'dark skin',
        'анатомически верная': 'anatomically correct',
        'на фоне': 'against background',
        'синее небо': 'blue sky',
        'облака': 'clouds',
        'небо': 'sky',
        'растет': 'growing',
        'из': 'from',
        'груди': 'chest',
        'рог': 'horn',
        'рога': 'horns',
        'кожа': 'skin',
        'анима': 'anime',
        'аниме': 'anime',
        'стиль': 'style',
        'красивая': 'beautiful',
        'красивый': 'handsome',
        'милая': 'cute',
        'милый': 'cute',
        'энергичный': 'energetic',
        'дружелюбный': 'friendly',
        'поддерживающий': 'supportive',
        'саркастичный': 'sarcastic',
        'мотивирующий': 'motivating'
    }
    
    # Simple word-by-word translation
    result = text.lower()
    for russian, english in translations.items():
        result = result.replace(russian, english)
    
    # Clean up and make it more natural
    result = result.replace('  ', ' ').strip()
    
    # Add some context to make it more suitable for image generation
    if 'cat' in result or 'dog' in result:
        result = f"cute {result}, digital art"
    elif 'girl' in result or 'woman' in result or 'boy' in result or 'man' in result:
        result = f"portrait of {result}, digital art"
    else:
        result = f"{result}, digital art"
    
    return result

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for characters
characters_db = {}

def create_system_prompt(character_data):
    """Create detailed system prompt based on character traits"""
    
    character_traits_dict = {
        'Дружелюбный': 'Общительный, открытый и готовый поддержать разговор на любую тему',
        'Саркастичный': 'Использует иронию и сарказм для легкого подтрунивания и веселого общения',
        'Эмпатичный': 'Способен понимать чувства собеседника и проявлять сочувствие',
        'Энергичный': 'Полон энтузиазма и позитивного настроя',
        'Спокойный': 'Спокоен даже в сложных ситуациях, помогает сохранять спокойствие другим',
        'Креативный': 'Творчески подходит к решению проблем и созданию идей',
        'Аналитический': 'Логически мыслит, способен анализировать ситуации и давать обоснованные рекомендации',
        'Поддерживающий': 'Всегда готов оказать поддержку и подбодрить',
        'Мотивирующий': 'Стремится вдохновлять и мотивировать собеседников достигать целей',
    }

    communic_tone = {
        'Дружелюбный': 'Теплый и приветливый тон, создающий атмосферу доверия',
        'Официальный': 'Четкость формулировок, соблюдение формальных норм общения',
        'Ироничный': 'Легкая доля юмора и самоиронии делает общение живым и интересным',
        'Саркастичный': 'Сарказм используется аккуратно, чтобы добавить остроты диалогу, но не обидеть собеседника'
    }

    initiative_level_dict = {
        'Высокий': 'Активно инициирует разговоры, предлагает помощь и вовлекается в обсуждение',
        'Средний': 'Реагирует на запросы, иногда сам проявляет инициативу',
        'Низкий': 'Только отвечает на вопросы и редко проявляет самостоятельную активность'
    }

    style_and_language_dict = {
        'Неформальная': 'Свободный стиль речи, использование сокращений и просторечий',
        'Полуформальная': 'Более структурированный язык, однако допускаются некоторые упрощения',
        'Официальная': 'Точность выражений, отсутствие эмоциональных отступлений',
        'Простой': 'Доступный язык, понятный широкой аудитории',
        'Средний': 'Использование литературных оборотов и более сложной лексики',
        'Экспертный': 'Сложные термины и глубокое погружение в предмет обсуждения',
        'Да': 'Частое использование эмодзи для передачи эмоций и настроения',
        'Нет': 'Не используется эмодзи',
        'Умеренно': 'Эмодзи используются избирательно, преимущественно для подчеркивания ключевых моментов'
    }
    
    # Get personality description
    personality_desc = character_traits_dict.get(character_data.personalityType, '')
    
    # Get character traits descriptions
    traits_descriptions = []
    for trait in character_data.characterTraits:
        if trait in character_traits_dict:
            traits_descriptions.append(character_traits_dict[trait])
    
    # Get communication tone
    tone_desc = communic_tone.get(character_data.communicationTone, '')
    
    # Get initiative level
    initiative_desc = initiative_level_dict.get(character_data.initiativeLevel, '')
    
    # Get formality and language complexity
    formality_desc = style_and_language_dict.get(character_data.formality, '')
    language_desc = style_and_language_dict.get(character_data.languageComplexity, '')
    
    # Get emoji usage
    emoji_desc = style_and_language_dict.get(character_data.useEmoji, '')
    
    system_prompt = f"""
    Ты {character_data.name}, {character_data.role}, специализирующийся на помощи {character_data.targetAudience}.
    Твой характер: {personality_desc}, основные черты: {', '.join(traits_descriptions)}.
    Стиль общения: {tone_desc}, уровень инициативы: {initiative_desc}.
    Формальность: {formality_desc}, сложность языка: {language_desc}.
    {emoji_desc if character_data.useEmoji.lower() in ["да", "умеренно"] else ""}
    Типичные фразы: {', '.join(character_data.typicalPhrases)}
    Основные задачи: {', '.join(character_data.mainTasks)}
    Ограничения: {character_data.behaviorLimits}, запрещенные темы: {', '.join(character_data.forbiddenTopics)}
    Контекстная память: {character_data.contextMemory}
    """
    
    return system_prompt.strip()

# Test characters
test_characters = [
    {
        "id": "b3aa10f2-2a27-4724-a109-a9c55e942c73",
        "name": "Алиса",
        "role": "Помощник",
        "description": "Дружелюбный и полезный ИИ помощник",
        "personality": "friendly",
        "tone": "casual",
        "language": "russian",
        "avatar": "",
        "rating": 5,
        "chats": 0,
        "system_prompt": "Ты Алиса, дружелюбный и полезный ИИ помощник. Ты всегда готова помочь и поддержать пользователя."
    },
    {
        "id": "test-character-2",
        "name": "Борис",
        "role": "Эксперт",
        "description": "Профессиональный эксперт в различных областях",
        "personality": "professional",
        "tone": "formal",
        "language": "russian",
        "avatar": "",
        "rating": 5,
        "chats": 0,
        "system_prompt": "Ты Борис, профессиональный эксперт. Ты даешь точные и обоснованные ответы на вопросы пользователей."
    }
]

# Initialize test characters
for char_data in test_characters:
    characters_db[char_data["id"]] = char_data

@app.get("/")
async def root():
    return {"message": "AI Characters API is running"}

@app.post("/characters")
async def create_character(character_data: CharacterCreateRequest):
    """Create a new character"""
    try:
        print(f"DEBUG: Received character data: {character_data}")
        character_id = str(uuid.uuid4())
        
        # Generate avatar based on description or name
        avatar_data = generate_avatar(character_data.description or character_data.name)
        print(f"DEBUG: Generated avatar data length: {len(avatar_data) if avatar_data else 0}")

        # Create character object
        character = {
            "id": character_id,
            "name": character_data.name,
            "role": character_data.role,
            "description": character_data.description,
            "personality": character_data.personalityType,
            "tone": character_data.communicationTone,
            "language": character_data.language,
            "avatar": avatar_data,
            "rating": 5,
            "chats": 0,
            "system_prompt": create_system_prompt(character_data)
        }
        
        characters_db[character_id] = character
        print(f"DEBUG: Character created with ID: {character_id}")
        
        return {
            "success": True,
            "characterId": character_id
        }
    except Exception as e:
        print(f"DEBUG: Error creating character: {e}")
        return {
            "success": False,
            "characterId": "",
            "error": str(e)
        }

@app.get("/characters")
async def get_all_characters():
    """Get all characters"""
    try:
        return {
            "success": True,
            "characters": list(characters_db.values())
        }
    except Exception as e:
        return {
            "success": False,
            "characters": []
        }

@app.get("/characters/recommended")
async def get_recommended_character():
    """Get recommended character"""
    try:
        if characters_db:
            character = next(iter(characters_db.values()))
            return {
                "success": True,
                "character": character
            }
        return {
            "success": False,
            "character": None,
            "error": "No characters available"
        }
    except Exception as e:
        return {
            "success": False,
            "character": None,
            "error": str(e)
        }

@app.get("/characters/{character_id}")
async def get_character(character_id: str):
    """Get character by ID"""
    try:
        character = characters_db.get(character_id)
        if character:
            return {
                "success": True,
                "character": character
            }
        else:
            return {
                "success": False,
                "character": None,
                "error": "Character not found"
            }
    except Exception as e:
        return {
            "success": False,
            "character": None,
            "error": str(e)
        }

@app.post("/chat/{character_id}/generate")
async def generate_chat_response(character_id: str, request: ChatRequest):
    """Generate chat response for a character using Mistral AI"""
    try:
        character = characters_db.get(character_id)
        if not character:
            return {
                "success": False,
                "response": "",
                "error": "Character not found"
            }
        
        # Create chat history context
        history_context = ""
        if request.history:
            history_context = "\n".join([
                f"Пользователь: {msg.get('user', '')}\n{character['name']}: {msg.get('assistant', '')}"
                for msg in request.history
            ])
        
        # Build the user prompt with context
        user_prompt = request.message
        if history_context:
            user_prompt = f"{history_context}\n\nПользователь: {request.message}"
        
        # Use Mistral AI to generate response
        try:
            bot = BotFactory.create_bot("mistral")
            response_text = bot.generate_text(
                system_prompt=character['system_prompt'],
                user_prompt=user_prompt
            )
        except Exception as ai_error:
            # Fallback to simple response if AI fails
            response_text = f"Привет! Я {character['name']}, {character['role']}. {character['description']}"
            print(f"AI Error: {ai_error}")
        
        return {
            "success": True,
            "response": response_text
        }
    except Exception as e:
        return {
            "success": False,
            "response": "",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
