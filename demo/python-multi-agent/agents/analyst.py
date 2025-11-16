"""
Analyst Agent - The parietal cortex of NeuroFabric
Synthesizes results from specialists and provides coherent insights
"""

from typing import Optional
from core.agent_base import Agent
from core.message import Message, Performative
from core.logger import get_logger


class Analyst(Agent):
    """
    Analyst interprets context and synthesizes specialist outputs.
    
    Responsibilities:
    - Integrate findings from multiple specialists
    - Resolve conflicts or inconsistencies
    - Produce coherent, actionable insights
    - Pass to Super-Critic for validation
    """
    
    async def process(self, message: Message) -> Optional[Message]:
        """Synthesize specialist responses"""
        
        if message.performative == Performative.REQUEST:
            return await self.synthesize(message)
        
        elif message.performative == Performative.INFORM and message.sender == "super_critic":
            return await self.handle_critic_feedback(message)
        
        return None
    
    async def synthesize(self, message: Message) -> Message:
        """Synthesize specialist findings into coherent output"""
        
        
        synthesis_prompt = f"""
        You are synthesizing results from multiple specialist agents.
        
        {message.content}
        
        Your task:
        1. Integrate the findings into a coherent narrative
        2. Highlight key insights and patterns
        3. Provide actionable conclusions
        4. Note any conflicts or uncertainties
        
        Be clear, concise, and insightful.
        """
        
        synthesis = await self.call_llm(synthesis_prompt)
        
        
        # Send to Super-Critic for validation
        await self.send_message(
            receiver="super_critic",
            content=f"SYNTHESIS TO VALIDATE:\n\n{synthesis}",
            performative=Performative.EVALUATE,
            reply_to=message.reply_to,
            summary="Requesting quality evaluation"
        )
        
        return None  # Wait for critic's response
    
    async def handle_critic_feedback(self, message: Message) -> Optional[Message]:
        """Handle feedback from Super-Critic"""
        
        logger = get_logger()
        logger.log_workflow(self.agent_id, "HANDLE_CRITIC_FEEDBACK", "Processing critic response")
        
        content = message.content
        
        # Extract approved content - handle both explicit APPROVED and implicit approval
        if content.startswith("APPROVED:"):
            approved_content = content.replace("APPROVED:", "", 1).strip()
        elif "REVISE:" in content[:50]:
            # Send back with critic's note
            reason = content.replace("REVISE:", "").strip()
            await self.send_message(
                receiver="fabric",
                content=f"[Note: Super-Critic flagged for revision]\n\n{reason}",
                performative=Performative.INFORM,
                reply_to=message.reply_to,
                summary="Result with critic notes"
            )
            return None
        else:
            # Treat as implicit approval - the critic's evaluation itself
            approved_content = content
        
        logger.log_workflow(self.agent_id, "SEND_FINAL_RESULT", "Sending to fabric")
        
        # Send final result back to fabric
        await self.send_message(
            receiver="fabric",
            content=approved_content,
            performative=Performative.INFORM,
            reply_to=message.reply_to,
            summary="Final synthesized result"
        )
        
        return None
