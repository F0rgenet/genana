# from fastapi import FastAPI, HTTPException, Depends
# from pydantic import BaseModel
# from typing import List, Optional
# import uuid
# from mistralai import MistralClient
# import models as md


import uvicorn
from fastapi import FastAPI
from api import app  # Импортируем наше приложение FastAPI

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Автоматическая перезагрузка при изменении кода
        log_level="info"
    )



    
