"""
Super-Critic Agent - Quality control and validation
Inspired by basal ganglia and anterior cingulate cortex
"""

from typing import Optional
from core.agent_base import Agent
from core.message import Message, Performative


class SuperCritic(Agent):
    """
    Super-Critic evaluates output quality and filters results.
    
    Responsibilities:
    - Validate logical consistency
    - Check for errors or hallucinations
    - Assess completeness and relevance
    - Approve or request revisions
    """
    
    async def process(self, message: Message) -> Optional[Message]:
        """Evaluate outputs from Analyst"""
        
        if message.performative == Performative.EVALUATE:
            return await self.evaluate(message)
        
        return None
    
    async def evaluate(self, message: Message) -> Message:
        """Critically evaluate analyst's synthesis"""
        
        
        critique_prompt = f"""
        You are a critical evaluator ensuring quality control.
        
        {message.content}
        
        Evaluate this output for:
        1. Logical consistency and coherence
        2. Factual accuracy (flag any potential errors)
        3. Completeness (does it address the original request?)
        4. Clarity and usefulness
        
        Respond with EXACTLY ONE of these formats:
        
        APPROVED: <the original content to send to user>
        
        OR
        
        REVISE: <specific reason why revision is needed>
        
        Be thorough but fair.
        """
        
        evaluation = await self.call_llm(critique_prompt)
        
        # Parse the evaluation
        if "APPROVED" in evaluation[:20]:
            pass  # evaluation already contains APPROVED
        elif "REVISE" in evaluation[:20]:
            pass  # evaluation already contains REVISE
        else:
            evaluation = f"APPROVED: {evaluation}"
        
        # Send feedback to Analyst
        await self.send_message(
            receiver="analyst",
            content=evaluation,
            performative=Performative.INFORM,
            reply_to=message.reply_to,
            summary="Quality evaluation complete"
        )
        
        return None
