import sys
from loguru import logger

def setup_logging():
    logger.remove()
    logger.add(sys.stderr, level="INFO")
    logger.add("logs/backend.log", rotation="10 MB", retention="10 days", level="DEBUG")

logger.info("Logger setup complete.")
