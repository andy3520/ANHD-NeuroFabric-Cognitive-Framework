"""
Base Agent class for NeuroFabric cognitive architecture
"""

import asyncio
import time
from abc import ABC, abstractmethod
from typing import Optional
import yaml
from litellm import acompletion

from core.message import Message, Performative, MessageBus
from core.logger import get_logger


class Agent(ABC):
    """
    Base class for all NeuroFabric agents.
    
    Each agent is a semi-autonomous cell in the cognitive network,
    specialized for specific tasks but coordinated through message-passing.
    """
    
    def __init__(self, agent_id: str, config: dict, message_bus: MessageBus):
        self.agent_id = agent_id
        self.config = config
        self.message_bus = message_bus
        self.inbox: asyncio.Queue = asyncio.Queue()
        
        # Subscribe to message bus
        message_bus.subscribe(agent_id, self.receive_message)
        
        # Agent-specific configuration
        self.model = config.get("model", "gpt-4o-mini")
        self.system_prompt = config.get("system_prompt", "You are a helpful AI agent.")
        self.temperature = config.get("temperature", 0.7)
    
    async def receive_message(self, message: Message):
        """Handle incoming message"""
        await self.inbox.put(message)
        
        logger = get_logger()
        logger.log_message(
            sender=message.sender,
            receiver=self.agent_id,
            performative=message.performative.value,
            summary=message.summary or message.content[:50]
        )
    
    async def send_message(
        self, 
        receiver: str, 
        content: str, 
        performative: Performative = Performative.INFORM,
        reply_to: Optional[str] = None,
        summary: str = ""
    ) -> Message:
        """Send message to another agent"""
        message = Message(
            performative=performative,
            sender=self.agent_id,
            receiver=receiver,
            content=content,
            reply_to=reply_to,
            summary=summary
        )
        
        logger = get_logger()
        logger.log_message(
            sender=self.agent_id,
            receiver=receiver,
            performative=performative.value,
            summary=summary or content[:50]
        )
        
        await self.message_bus.publish(message)
        return message
    
    async def call_llm(self, prompt: str, system_override: Optional[str] = None) -> str:
        """
        Call LLM with agent's configuration.
        Uses LiteLLM for unified API across providers.
        """
        logger = get_logger()
        start_time = time.time()
        
        try:
            logger.log_workflow(self.agent_id, "LLM_CALL_START", f"Model: {self.model}")
            
            response = await asyncio.wait_for(
                acompletion(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_override or self.system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=self.temperature
                ),
                timeout=30.0
            )
            
            duration_ms = (time.time() - start_time) * 1000
            
            # Extract token usage
            usage = response.usage
            prompt_tokens = usage.prompt_tokens if usage else 0
            completion_tokens = usage.completion_tokens if usage else 0
            
            logger.log_llm_call(
                agent=self.agent_id,
                model=self.model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                duration_ms=duration_ms
            )
            
            logger.log_workflow(
                self.agent_id, 
                "LLM_CALL_COMPLETE", 
                f"Tokens: {prompt_tokens}→{completion_tokens}",
                duration_ms=duration_ms
            )
            
            return response.choices[0].message.content
            
        except asyncio.TimeoutError:
            error_msg = "LLM call timed out after 30 seconds"
            logger.log_error(self.agent_id, error_msg)
            return f"ERROR: {error_msg}"
        except Exception as e:
            logger.log_error(self.agent_id, f"LLM Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"ERROR: {str(e)}"
    
    @abstractmethod
    async def process(self, message: Message) -> Optional[Message]:
        """
        Process incoming message and optionally return response.
        Must be implemented by each agent subclass.
        """
        pass
    
    async def run(self):
        """Main event loop for agent"""
        logger = get_logger()
        logger.log_workflow(self.agent_id, "AGENT_STARTED", "Ready to process messages")
        
        while True:
            message = await self.inbox.get()
            
            try:
                response = await self.process(message)
                if response:
                    await self.message_bus.publish(response)
            except Exception as e:
                logger.log_error(self.agent_id, f"Processing error: {str(e)}")
                
                # Send error response
                await self.send_message(
                    receiver=message.sender,
                    content=f"ERROR: {str(e)}",
                    performative=Performative.REJECT,
                    reply_to=message.message_id,
                    summary=f"Processing failed: {str(e)[:50]}"
                )


def load_agent_config(config_path: str = "config.yaml") -> dict:
    """Load agent configurations from YAML"""
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)
