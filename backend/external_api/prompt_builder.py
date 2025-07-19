
from typing import List
from backend.schemas import Character

def _format_list(items: List[str], default: str = "Not specified") -> str:
    """Formats a list into a comma-separated string, or returns a default if empty."""
    return ", ".join(items) if items else default

def build_system_prompt(character: Character) -> str:
    """
    Constructs a detailed system prompt for an LLM based on the character's attributes.
    """
    prompt_parts = [
        "You are an AI assistant role-playing as a character. Your goal is to engage the user according to the persona defined below. Follow these instructions precisely.",
        "\n--- CHARACTER PERSONA ---",
        f"**Name:** {character.name}",
        f"**Role:** {character.role}",
        f"**Target Audience:** {character.target_audience or 'General audience'}",
        
        "\n--- BEHAVIOR & PERSONALITY ---",
        f"**Personality Type:** {character.personality_type or 'Not specified'}",
        f"**Key Character Traits:** {_format_list(character.character_traits)}",
        f"**Communication Tone:** {character.communication_tone or 'Neutral'}",
        f"**Initiative Level:** As a character with '{character.initiative_level or 'passive'}' initiative, you should act accordingly in conversation.",

        "\n--- LANGUAGE & STYLE ---",
        f"**Speaking Language:** {character.custom_language or character.language or 'English'}",
        f"**Formality:** {character.formality or 'Neutral'}",
        f"**Language Complexity:** {character.language_complexity or 'Simple'}",
        f"**Use of Emoji:** {character.use_emoji or 'No'}",
        f"**Typical Phrases to Use:** {_format_list(character.typical_phrases)}",

        "\n--- SCENARIO & TASKS ---",
        f"**Main Tasks:** Your primary goal is to: {_format_list(character.main_tasks, 'Engage in conversation.')}",
        f"**Context & Memory:** {character.context_memory or 'You should remember the context of the current conversation.'}",

        "\n--- RESTRICTIONS & SAFETY ---",
        f"**Forbidden Topics:** You must strictly avoid discussing the following topics: {_format_list(character.forbidden_topics, 'None')}",
        f"**Behavioral Limits:** {character.behavior_limits or 'No specific behavioral limits.'}",
        f"**Content Filter:** A content filter is {'enabled' if character.content_filter else 'disabled'}. You must adhere to content safety guidelines.",

        "\n--- INSTRUCTIONS ---",
        "1. **Stay in Character:** Do not break character under any circumstances. Do not mention that you are an AI or a language model.",
        "2. **Engage Naturally:** Respond to the user in a way that is consistent with your defined persona.",
        "3. **Follow all Rules:** Adhere strictly to the behavior, language, and restriction rules outlined above.",
        "Your first message should be an engaging greeting in character."
    ]
    
    return "\n".join(prompt_parts)


def build_description_prompt(character_data: dict) -> str:
    """
    Constructs a prompt to generate a short, engaging character description in Russian.
    """
    # Extract key characteristics, providing defaults for missing values
    name = character_data.get('name', 'Неизвестный')
    role = character_data.get('role', 'собеседник')
    personality = character_data.get('personality_type', 'уникальный')
    traits = ", ".join(character_data.get('character_traits', [])) or 'интересный'
    tone = character_data.get('communication_tone', 'нейтральный')
    tasks = ", ".join(character_data.get('main_tasks', [])) or 'вести беседу'

    prompt = f"""
Задача: Напиши короткое, привлекательное и ясное описание для чат-бота на русском языке.
Описание должно быть в одном абзаце, состоять из 2-3 предложений и не превышать 250 символов.
Оно должно дать пользователю четкое представление о том, с кем он будет общаться.

Используй следующие характеристики:
- **Имя:** {name}
- **Роль:** {role}
- **Личность:** {personality}, {traits}
- **Стиль общения:** {tone}
- **Основная задача:** {tasks}

Пример хорошего описания:
"Познакомьтесь с {name}, вашим персональным {role}. Обладая {personality} характером, он поможет вам {tasks}, общаясь в {tone} манере. Начните диалог и узнайте больше!"

Твой результат должен быть только текстом описания, без лишних фраз вроде "Вот описание:".
"""
    return prompt.strip()
