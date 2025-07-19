import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from loguru import logger

# Определяем путь к базе данных относительно текущего файла
# Это сделает путь независимым от того, откуда запускается приложение
DATABASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(DATABASE_DIR, "..", "genana.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_FILE}"

logger.info(f"Database URL: {SQLALCHEMY_DATABASE_URL}")

# connect_args={"check_same_thread": False} нужен только для SQLite.
# Он позволяет нескольким потокам использовать одно и то же соединение.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal будет использоваться для создания сессий с базой данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base будет использоваться как базовый класс для всех моделей SQLAlchemy
Base = declarative_base()

# Функция для создания таблиц в базе данных
def create_db_and_tables():
    # Импортируем модели здесь, чтобы избежать циклических зависимостей
    from . import models
    logger.info("Creating database and tables.")
    Base.metadata.create_all(bind=engine)
    logger.info("Database and tables created.")

# Функция-зависимость для получения сессии базы данных в FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        logger.debug("Closing database session.")
        db.close()
