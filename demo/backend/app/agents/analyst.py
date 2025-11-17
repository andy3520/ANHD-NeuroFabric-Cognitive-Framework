"""Analyst agent - performs analysis and synthesis."""
from typing import Optional
from .base_agent import BaseAgent
from ..models import Message, MessageType, AgentType
from ..core.config import settings
from ..core.logger import get_logger

logger = get_logger(__name__)


class AnalystAgent(BaseAgent):
    """Analyst agent for general analysis tasks."""
    
    def __init__(self):
        super().__init__(
            agent_type=AgentType.ANALYST,
            model=settings.analyst_model,
        )
    
    def _default_system_prompt(self) -> str:
        return """You are an Analyst agent specialized in data analysis and synthesis.

Your role is to:
- Analyze information provided by other agents
- Identify patterns, trends, and insights
- Synthesize multiple data points into coherent conclusions
- Provide clear, actionable recommendations

Be analytical, thorough, and precise in your responses."""
    
    async def process_message(self, message: Message) -> Optional[str]:
        """Process analysis request."""
        if message.type not in [MessageType.REQUEST, MessageType.QUERY]:
            return None
        
        logger.info(f"Analyst processing: {message.content[:100]}...")
        
        response, _, _, _ = await self._call_llm(message.content)
        
        # Send response back
        await self.send_message(
            to=message.from_agent,
            content=response,
            type=MessageType.RESPONSE,
            parent_id=message.id,
        )
        
        return response
