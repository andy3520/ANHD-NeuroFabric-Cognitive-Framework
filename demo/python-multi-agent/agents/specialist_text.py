"""
Text Specialist Agent - Natural language understanding and analysis
"""

from typing import Optional
from core.agent_base import Agent
from core.message import Message, Performative


class SpecialistText(Agent):
    """
    Text Specialist handles NLP tasks.
    
    Capabilities:
    - Sentiment analysis
    - Text summarization
    - Semantic understanding
    - Language pattern recognition
    """
    
    async def process(self, message: Message) -> Optional[Message]:
        """Process text analysis tasks"""
        
        if message.performative == Performative.REQUEST:
            return await self.analyze(message)
        
        return None
    
    async def analyze(self, message: Message) -> Message:
        """Perform text analysis"""
        
        
        analysis_prompt = f"""
        You are a specialized natural language processing agent.
        
        USER REQUEST: {message.content}
        
        Provide:
        1. Sentiment analysis (if applicable)
        2. Key themes or topics
        3. Linguistic insights or patterns
        4. Text summary (if needed)
        
        Be clear and interpretable. Focus on qualitative insights.
        """
        
        result = await self.call_llm(analysis_prompt)
        
        
        # Send result back to coordinator
        await self.send_message(
            receiver=message.sender,
            content=result,
            performative=Performative.INFORM,
            reply_to=message.reply_to,
            summary="Text analysis complete"
        )
        
        return None
