"""Configuration and settings."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""
    
    # API Keys
    openai_api_key: str
    anthropic_api_key: Optional[str] = None
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Models
    default_model: str = "gpt-4-turbo-preview"
    coordinator_model: str = "gpt-4-turbo-preview"
    analyst_model: str = "gpt-4-turbo-preview"
    specialist_model: str = "gpt-3.5-turbo"
    critic_model: str = "gpt-4-turbo-preview"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
