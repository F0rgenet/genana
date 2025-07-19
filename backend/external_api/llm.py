import os
import httpx
from typing import List, Dict, Any
from loguru import logger
from dotenv import load_dotenv
from .prompt_builder import build_description_prompt

# Load environment variables from a .env file
load_dotenv()

# --- API Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# --- Model Name Constants ---
GEMINI_FLASH = "gemini-2.5-flash"
MISTRAL_LARGE = "mistral-large-latest"
MISTRAL_SMALL = "mistral-small-latest"


class BaseLLMClient:
    """Base class for LLM clients."""
    def __init__(self, api_key: str, api_url: str, model: str):
        if not api_key:
            raise ValueError(f"API key for {self.__class__.__name__} is not set.")
        self.api_key = api_key
        self.api_url = api_url
        self.model = model

    async def generate_text(
        self, system_prompt: str, user_message: str, history: List[Dict[str, str]]
    ) -> str:
        raise NotImplementedError

class GeminiClient(BaseLLMClient):
    """Client for Google Gemini API."""
    def __init__(self, api_key: str = GEMINI_API_KEY, model: str = GEMINI_FLASH):
        super().__init__(api_key, GEMINI_API_URL.format(model=model), model)

    async def generate_text(
        self, system_prompt: str, user_message: str, history: List[Dict[str, str]]
    ) -> str:
        headers = {"Content-Type": "application/json"}
        params = {"key": self.api_key}
        
        # Gemini uses a specific format for contents
        contents = []
        for item in history:
            # Gemini uses 'model' for the assistant's role
            role = "model" if item["role"] == "assistant" else item["role"]
            contents.append({"role": role, "parts": [{"text": item["content"]}]})
        contents.append({"role": "user", "parts": [{"text": user_message}]})

        payload = {
            "contents": contents,
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.95,
            },
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, headers=headers, params=params, json=payload, timeout=60)
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except httpx.HTTPStatusError as e:
                logger.error(f"Gemini API Error: {e.response.text}")
                raise
            except Exception as e:
                logger.error(f"An unexpected error occurred with Gemini client: {e}")
                raise

class MistralClient(BaseLLMClient):
    """Client for Mistral AI API."""
    def __init__(self, api_key: str = MISTRAL_API_KEY, model: str = MISTRAL_LARGE):
        super().__init__(api_key, MISTRAL_API_URL, model)

    async def generate_text(
        self, system_prompt: str, user_message: str, history: List[Dict[str, str]]
    ) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        messages = [
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": user_message},
        ]

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "top_p": 1,
            "safe_prompt": True,
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=60)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except httpx.HTTPStatusError as e:
                logger.error(f"Mistral API Error: {e.response.text}")
                raise
            except Exception as e:
                logger.error(f"An unexpected error occurred with Mistral client: {e}")
                raise

class LLMFactory:
    """Factory to get the appropriate LLM client based on the model name."""
    
    _clients = {
        GEMINI_FLASH: GeminiClient,
        MISTRAL_LARGE: MistralClient,
        MISTRAL_SMALL: MistralClient,
    }

    @staticmethod
    def get_client(model_name: str) -> BaseLLMClient:
        client_class = LLMFactory._clients.get(model_name)
        if not client_class:
            raise ValueError(f"Unsupported AI model: {model_name}")
        
        logger.info(f"Initializing LLM client for model: {model_name}")
        return client_class(model=model_name)

# Instantiate the factory
llm_factory = LLMFactory()

async def generate_description(character_data: dict) -> str:
    """
    Generates a character description using an LLM.
    Uses Gemini Flash by default as a cost-effective choice.
    """
    logger.info(f"Generating description for character: {character_data.get('name')}")
    try:
        # Build the specific prompt for description generation
        prompt = build_description_prompt(character_data)
        
        # For description generation, we can hardcode a cost-effective model
        # or make it configurable if needed later.
        client = GeminiClient(model=GEMINI_FLASH)

        # Use the generate_text method with a simplified payload
        # No system prompt or history is needed, the user message is the whole prompt
        description = await client.generate_text(
            system_prompt="You are a creative copywriter.", # A simple, relevant system prompt
            user_message=prompt,
            history=[]
        )
        
        logger.info(f"Successfully generated description: {description}")
        return description.strip().replace('"', '') # Clean up quotes
    except Exception as e:
        logger.error(f"Failed to generate character description: {e}")
        # Return a default or empty description on failure
        return "Загадочный персонаж, готовый к общению."
