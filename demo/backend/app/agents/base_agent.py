"""Base agent class."""
import time
import uuid
from typing import Optional, Callable, Awaitable
from ..models import Message, MessageType, AgentType, AgentMetrics, TokenUsage
from ..services import llm_service
from ..core.logger import get_logger

logger = get_logger(__name__)


class BaseAgent:
    """Base class for all agents."""
    
    def __init__(
        self,
        agent_type: AgentType,
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
    ):
        """Initialize agent."""
        self.agent_type = agent_type
        self.model = model
        self.system_prompt = system_prompt or self._default_system_prompt()
        self.metrics = AgentMetrics(
            agent_id=agent_type,
            status="idle",
        )
        self.message_callback: Optional[Callable[[Message], Awaitable[None]]] = None
        self.metric_callback: Optional[Callable[[AgentMetrics], Awaitable[None]]] = None
    
    def _default_system_prompt(self) -> str:
        """Default system prompt for this agent."""
        return "You are a helpful AI assistant."
    
    def set_message_callback(self, callback: Callable[[Message], Awaitable[None]]):
        """Set callback for when messages are sent."""
        self.message_callback = callback
    
    def set_metric_callback(self, callback: Callable[[AgentMetrics], Awaitable[None]]):
        """Set callback for metric updates."""
        self.metric_callback = callback
    
    async def _emit_message(self, message: Message):
        """Emit a message through callback."""
        if self.message_callback:
            await self.message_callback(message)
    
    async def _emit_metric_update(self):
        """Emit metric update through callback."""
        if self.metric_callback:
            await self.metric_callback(self.metrics)
    
    async def send_message(
        self,
        to: AgentType,
        content: str,
        type: MessageType = MessageType.INFORM,
        parent_id: Optional[str] = None,
    ) -> Message:
        """Send a message to another agent."""
        message = Message(
            id=f"msg-{uuid.uuid4().hex[:12]}",
            from_agent=self.agent_type,
            to_agent=to,
            content=content,
            type=type,
            timestamp=int(time.time() * 1000),
            parent_message_id=parent_id,
        )
        
        self.metrics.messages_sent += 1
        await self._emit_message(message)
        await self._emit_metric_update()
        
        return message
    
    async def process_message(self, message: Message) -> Optional[str]:
        """
        Process an incoming message.
        Should be overridden by subclasses.
        
        Returns:
            Response text or None
        """
        raise NotImplementedError("Subclasses must implement process_message")
    
    async def _call_llm(
        self,
        user_message: str,
        context: Optional[list[dict]] = None,
    ) -> tuple[str, TokenUsage, float, int]:
        """Call LLM with tracking."""
        self.metrics.status = "thinking"
        await self._emit_metric_update()
        
        start_time = time.time()
        
        messages = [{"role": "system", "content": self.system_prompt}]
        if context:
            messages.extend(context)
        messages.append({"role": "user", "content": user_message})
        
        response, tokens, cost, llm_time = await llm_service.chat_completion(
            messages=messages,
            model=self.model,
        )
        
        # Update metrics
        self.metrics.llm_calls += 1
        self.metrics.tokens.prompt += tokens.prompt
        self.metrics.tokens.completion += tokens.completion
        self.metrics.tokens.total += tokens.total
        self.metrics.cost += cost
        self.metrics.processing_time += int((time.time() - start_time) * 1000)
        self.metrics.status = "done"
        
        await self._emit_metric_update()
        
        return response, tokens, cost, llm_time
    
    def reset_metrics(self):
        """Reset agent metrics."""
        self.metrics = AgentMetrics(
            agent_id=self.agent_type,
            status="idle",
        )
