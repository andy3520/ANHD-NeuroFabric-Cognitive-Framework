"""Text Specialist agent - handles text processing and writing."""
from typing import Optional
from .base_agent import BaseAgent
from ..models import Message, MessageType, AgentType
from ..core.config import settings
from ..core.logger import get_logger

logger = get_logger(__name__)


class TextSpecialistAgent(BaseAgent):
    """Text specialist for text processing and writing tasks."""
    
    def __init__(self):
        super().__init__(
            agent_type=AgentType.SPECIALIST_TEXT,
            model=settings.specialist_model,
        )
    
    def _default_system_prompt(self) -> str:
        return """You are a Text Specialist agent with expertise in:
- Text summarization and extraction
- Writing and content creation
- Language processing and comprehension
- Document analysis and synthesis

Provide clear, well-written responses with proper structure and formatting."""
    
    async def process_message(self, message: Message) -> Optional[str]:
        """Process text-related requests."""
        if message.type not in [MessageType.REQUEST, MessageType.QUERY]:
            return None
        
        logger.info(f"Text Specialist processing: {message.content[:100]}...")
        
        response, _, _, _ = await self._call_llm(message.content)
        
        # Send response back
        await self.send_message(
            to=message.from_agent,
            content=response,
            type=MessageType.RESPONSE,
            parent_id=message.id,
        )
        
        return response
