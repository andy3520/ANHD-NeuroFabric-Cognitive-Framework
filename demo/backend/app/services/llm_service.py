"""LLM service for interacting with AI models."""
import time
from typing import AsyncGenerator, Optional
from openai import AsyncOpenAI
from ..core.config import settings
from ..core.logger import get_logger
from ..models.metrics import TokenUsage

logger = get_logger(__name__)


class LLMService:
    """Service for LLM interactions."""
    
    def __init__(self):
        """Initialize LLM clients."""
        self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.pricing = {
            "gpt-4-turbo-preview": {"prompt": 0.01 / 1000, "completion": 0.03 / 1000},
            "gpt-4": {"prompt": 0.03 / 1000, "completion": 0.06 / 1000},
            "gpt-3.5-turbo": {"prompt": 0.0005 / 1000, "completion": 0.0015 / 1000},
        }
    
    async def chat_completion(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> tuple[str, TokenUsage, float, int]:
        """
        Get chat completion from LLM.
        
        Returns:
            Tuple of (response_text, token_usage, cost, processing_time_ms)
        """
        model = model or settings.default_model
        start_time = time.time()
        
        try:
            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # Extract usage
            usage = response.usage
            token_usage = TokenUsage(
                prompt=usage.prompt_tokens,
                completion=usage.completion_tokens,
                total=usage.total_tokens,
            )
            
            # Calculate cost
            cost = self._calculate_cost(model, token_usage)
            
            # Get response text
            response_text = response.choices[0].message.content or ""
            
            logger.info(
                f"LLM call completed: model={model}, tokens={token_usage.total}, "
                f"cost=${cost:.6f}, time={processing_time}ms"
            )
            
            return response_text, token_usage, cost, processing_time
            
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            raise
    
    async def chat_completion_stream(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Get streaming chat completion from LLM.
        
        Yields:
            Response text chunks
        """
        model = model or settings.default_model
        
        try:
            stream = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"LLM streaming failed: {e}")
            raise
    
    def _calculate_cost(self, model: str, usage: TokenUsage) -> float:
        """Calculate cost based on token usage."""
        if model not in self.pricing:
            # Default to gpt-4 pricing if unknown
            model = "gpt-4"
        
        prices = self.pricing[model]
        cost = (usage.prompt * prices["prompt"]) + (usage.completion * prices["completion"])
        return cost


# Global LLM service instance
llm_service = LLMService()
