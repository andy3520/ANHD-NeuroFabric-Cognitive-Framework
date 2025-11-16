"""
Math Specialist Agent - Numerical reasoning and statistical analysis
"""

from typing import Optional
from core.agent_base import Agent
from core.message import Message, Performative


class SpecialistMath(Agent):
    """
    Math Specialist handles quantitative tasks.
    
    Capabilities:
    - Statistical analysis
    - Numerical calculations
    - Data aggregation
    - Trend analysis
    """
    
    async def process(self, message: Message) -> Optional[Message]:
        """Process mathematical/statistical tasks"""
        
        if message.performative == Performative.REQUEST:
            return await self.analyze(message)
        
        return None
    
    async def analyze(self, message: Message) -> Message:
        """Perform mathematical analysis"""
        
        
        analysis_prompt = f"""
        You are a specialized mathematical and statistical agent.
        
        USER REQUEST: {message.content}
        
        Provide:
        1. Relevant calculations or statistical metrics
        2. Data trends or patterns (if applicable)
        3. Numerical insights
        
        Be precise and show your work. Use concrete numbers.
        """
        
        result = await self.call_llm(analysis_prompt)
        
        
        # Send result back to coordinator
        await self.send_message(
            receiver=message.sender,
            content=result,
            performative=Performative.INFORM,
            reply_to=message.reply_to,
            summary="Mathematical analysis complete"
        )
        
        return None
