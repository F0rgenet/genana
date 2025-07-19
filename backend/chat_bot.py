from mistralai import Mistral
import os
import config

class ChatBot:
    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        raise NotImplementedError("Subclasses must implement generate_text method")

class MistralBot(ChatBot):
    def __init__(self, api_key: str, model: str = "mistral-large-latest"):
        # Initialize client using shorthand Mistral class
        self.client = Mistral(api_key=api_key)
        self.model = model

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        try:
            # Build messages using simple dict format
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            # For SDK v1+, chat is a namespace; use .complete() to perform the request
            response = self.client.chat.complete(model=self.model, messages=messages)
            
            # Extract the response content
            if hasattr(response, 'choices') and response.choices:
                return response.choices[0].message.content
            else:
                return "Извините, не удалось получить ответ."
                
        except Exception as e:
            print(f"Mistral API Error: {e}")
            # Return a fallback response
            return f"Привет! Я готов помочь. {user_prompt}"

class BotFactory:
    @staticmethod
    def create_bot(bot_type: str = "mistral") -> ChatBot:
        if bot_type == "mistral":
            api_key = config.MISTRAL_API_KEY
            if not api_key or api_key == "your-default-api-key":
                raise ValueError("MISTRAL_API_KEY not set in environment variables")
            return MistralBot(api_key=api_key)
        # Добавьте другие типы ботов при необходимости
        raise ValueError(f"Unknown bot type: {bot_type}")


