"""Math Specialist agent - handles calculations and statistical analysis."""
from typing import Optional
from .base_agent import BaseAgent
from ..models import Message, MessageType, AgentType
from ..core.config import settings
from ..core.logger import get_logger

logger = get_logger(__name__)


class MathSpecialistAgent(BaseAgent):
    """Math specialist for calculations and statistical analysis."""
    
    def __init__(self):
        super().__init__(
            agent_type=AgentType.SPECIALIST_MATH,
            model=settings.specialist_model,
        )
    
    def _default_system_prompt(self) -> str:
        return """You are a Math Specialist agent with expertise in:
- Mathematical calculations and formulas
- Statistical analysis and probability
- Data interpretation and quantitative reasoning
- Number crunching and computational tasks

Provide precise, accurate mathematical results. Show your work when appropriate."""
    
    async def process_message(self, message: Message) -> Optional[str]:
        """Process math-related requests."""
        if message.type not in [MessageType.REQUEST, MessageType.QUERY]:
            return None
        
        logger.info(f"Math Specialist processing: {message.content[:100]}...")
        
        response, _, _, _ = await self._call_llm(message.content)
        
        # Send response back
        await self.send_message(
            to=message.from_agent,
            content=response,
            type=MessageType.RESPONSE,
            parent_id=message.id,
        )
        
        return response
