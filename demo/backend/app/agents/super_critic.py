"""Super-Critic agent - validates and critiques responses."""
from typing import Optional
from .base_agent import BaseAgent
from ..models import Message, MessageType, AgentType
from ..core.config import settings
from ..core.logger import get_logger

logger = get_logger(__name__)


class SuperCriticAgent(BaseAgent):
    """Super-Critic agent for quality assurance."""
    
    def __init__(self):
        super().__init__(
            agent_type=AgentType.SUPER_CRITIC,
            model=settings.critic_model,
        )
    
    def _default_system_prompt(self) -> str:
        return """You are a Super-Critic agent responsible for quality assurance.

Your role is to:
- Review responses from other agents
- Identify errors, inconsistencies, or gaps
- Verify accuracy and completeness
- Suggest improvements

Be thorough and constructive in your critique."""
    
    async def process_message(self, message: Message) -> Optional[str]:
        """Process critique request."""
        if message.type not in [MessageType.REQUEST, MessageType.QUERY]:
            return None
        
        logger.info(f"Super-Critic reviewing: {message.content[:100]}...")
        
        response, _, _, _ = await self._call_llm(message.content)
        
        # Send response back
        await self.send_message(
            to=message.from_agent,
            content=response,
            type=MessageType.RESPONSE,
            parent_id=message.id,
        )
        
        return response
