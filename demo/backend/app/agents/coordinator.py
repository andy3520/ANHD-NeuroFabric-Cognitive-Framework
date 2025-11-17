"""Coordinator agent - orchestrates the multi-agent system."""
from typing import Optional
from .base_agent import BaseAgent
from ..models import Message, MessageType, AgentType
from ..core.config import settings
from ..core.logger import get_logger

logger = get_logger(__name__)


class CoordinatorAgent(BaseAgent):
    """Coordinator agent that orchestrates task delegation."""
    
    def __init__(self):
        super().__init__(
            agent_type=AgentType.COORDINATOR,
            model=settings.coordinator_model,
        )
    
    def _default_system_prompt(self) -> str:
        return """You are the Coordinator agent in a multi-agent cognitive framework.

Your role is to:
1. Analyze incoming tasks and break them down into subtasks
2. Determine which specialist agents are needed (analyst, math specialist, text specialist)
3. Delegate subtasks to appropriate agents
4. Synthesize their responses into a comprehensive answer

Available specialist agents:
- analyst: For general analysis, insights, and synthesis
- specialist_math: For mathematical calculations, statistics, data analysis
- specialist_text: For text processing, summarization, writing

Be concise in your delegation. State clearly what each agent should do."""
    
    async def process_message(self, message: Message) -> Optional[str]:
        """Process task and coordinate agents."""
        if message.type != MessageType.REQUEST:
            return None
        
        task = message.content
        logger.info(f"Coordinator received task: {task[:100]}...")
        
        # Analyze task and create delegation plan
        analysis_prompt = f"""Analyze this task and determine which agents are needed:

Task: {task}

Respond with a JSON object containing:
{{
  "needs_analyst": true/false,
  "needs_math": true/false,
  "needs_text": true/false,
  "delegation_plan": "Brief explanation of how to divide the work"
}}"""
        
        response, _, _, _ = await self._call_llm(analysis_prompt)
        
        # Send delegation message
        await self.send_message(
            to=AgentType.SYSTEM,
            content=f"Task analysis complete. {response}",
            type=MessageType.INFORM,
            parent_id=message.id,
        )
        
        return response
    
    async def synthesize_final_answer(
        self,
        original_task: str,
        specialist_responses: dict[str, str],
    ) -> str:
        """Synthesize specialist responses into final answer."""
        logger.info("Coordinator synthesizing final answer")
        
        responses_text = "\n\n".join([
            f"{agent}: {response}"
            for agent, response in specialist_responses.items()
        ])
        
        synthesis_prompt = f"""Original task: {original_task}

Specialist responses:
{responses_text}

Synthesize these responses into a comprehensive, well-structured final answer that directly addresses the original task. Be thorough but concise."""
        
        final_answer, _, _, _ = await self._call_llm(synthesis_prompt)
        
        logger.info("Final answer synthesized")
        return final_answer
