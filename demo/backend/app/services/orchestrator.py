"""Orchestrator for coordinating the multi-agent system."""
import asyncio
from typing import Optional, Callable, Awaitable, Dict
from ..models import Message, MessageType, AgentType, AgentMetrics, TaskResponse
from ..agents import (
    CoordinatorAgent,
    AnalystAgent,
    MathSpecialistAgent,
    TextSpecialistAgent,
    SuperCriticAgent,
)
from ..services import memory_manager
from ..core.logger import get_logger

logger = get_logger(__name__)


class NeuroFabricOrchestrator:
    """Orchestrates the multi-agent cognitive framework."""
    
    def __init__(self):
        """Initialize orchestrator and agents."""
        self.coordinator = CoordinatorAgent()
        self.analyst = AnalystAgent()
        self.math_specialist = MathSpecialistAgent()
        self.text_specialist = TextSpecialistAgent()
        self.super_critic = SuperCriticAgent()
        
        self.agents = {
            AgentType.COORDINATOR: self.coordinator,
            AgentType.ANALYST: self.analyst,
            AgentType.SPECIALIST_MATH: self.math_specialist,
            AgentType.SPECIALIST_TEXT: self.text_specialist,
            AgentType.SUPER_CRITIC: self.super_critic,
        }
        
        # Message and metric collection
        self.messages: list[Message] = []
        self.metrics_map: Dict[AgentType, AgentMetrics] = {}
        
        # Callbacks for streaming
        self.message_callback: Optional[Callable[[Message], Awaitable[None]]] = None
        self.metric_callback: Optional[Callable[[AgentMetrics], Awaitable[None]]] = None
        
        # Setup agent callbacks
        self._setup_callbacks()
    
    def _setup_callbacks(self):
        """Setup callbacks for all agents."""
        for agent in self.agents.values():
            agent.set_message_callback(self._on_message)
            agent.set_metric_callback(self._on_metric_update)
    
    def set_message_callback(self, callback: Callable[[Message], Awaitable[None]]):
        """Set callback for message events."""
        self.message_callback = callback
    
    def set_metric_callback(self, callback: Callable[[AgentMetrics], Awaitable[None]]):
        """Set callback for metric events."""
        self.metric_callback = callback
    
    async def _on_message(self, message: Message):
        """Handle message from agent."""
        self.messages.append(message)
        if self.message_callback:
            await self.message_callback(message)
        logger.debug(f"Message: {message.from_agent} -> {message.to_agent}")
    
    async def _on_metric_update(self, metrics: AgentMetrics):
        """Handle metric update from agent."""
        self.metrics_map[metrics.agent_id] = metrics
        if self.metric_callback:
            await self.metric_callback(metrics)
        logger.debug(f"Metrics updated: {metrics.agent_id} - {metrics.status}")
    
    def reset(self):
        """Reset orchestrator state."""
        self.messages = []
        self.metrics_map = {}
        for agent in self.agents.values():
            agent.reset_metrics()
    
    async def process_task(self, task: str) -> TaskResponse:
        """
        Process a task through the multi-agent system.
        
        Args:
            task: The task to process
        
        Returns:
            TaskResponse with messages, metrics, and final answer
        """
        self.reset()
        logger.info(f"Processing task: {task[:100]}...")
        
        try:
            # Check memory for similar tasks
            similar_tasks = await memory_manager.retrieve_similar_tasks(task, limit=2)
            context_info = ""
            if similar_tasks:
                logger.info(f"Found {len(similar_tasks)} similar past tasks")
                context_info = "\n\nPast similar tasks:\n" + "\n".join([
                    f"- {t['task'][:100]}... (cost: ${t['metrics']['total_cost']})"
                    for t in similar_tasks
                ])
            
            # Step 1: Coordinator analyzes task
            enriched_task = task + context_info
            user_msg = Message(
                id="msg_user_request",
                from_agent=AgentType.USER,
                to_agent=AgentType.COORDINATOR,
                content=enriched_task,
                type=MessageType.REQUEST,
                timestamp=0,
            )
            await self._on_message(user_msg)
            
            delegation_plan = await self.coordinator.process_message(user_msg)
            
            # Step 2: Delegate to specialists in parallel
            specialist_tasks = []
            
            # Check which specialists are needed based on task
            needs_analyst = "analy" in task.lower() or "insight" in task.lower()
            needs_math = any(word in task.lower() for word in ["calculate", "number", "statistic", "data"])
            needs_text = any(word in task.lower() for word in ["write", "summarize", "text", "document"])
            
            # Always use at least analyst if nothing specific
            if not (needs_math or needs_text):
                needs_analyst = True
            
            specialist_responses = {}
            
            if needs_analyst:
                specialist_tasks.append(self._delegate_to_specialist(
                    self.analyst,
                    AgentType.ANALYST,
                    f"Analyze this task and provide insights: {task}",
                    specialist_responses,
                    "analyst"
                ))
            
            if needs_math:
                specialist_tasks.append(self._delegate_to_specialist(
                    self.math_specialist,
                    AgentType.SPECIALIST_MATH,
                    f"Handle mathematical/statistical aspects of: {task}",
                    specialist_responses,
                    "math"
                ))
            
            if needs_text:
                specialist_tasks.append(self._delegate_to_specialist(
                    self.text_specialist,
                    AgentType.SPECIALIST_TEXT,
                    f"Handle text processing aspects of: {task}",
                    specialist_responses,
                    "text"
                ))
            
            # Wait for all specialists
            if specialist_tasks:
                await asyncio.gather(*specialist_tasks)
            
            # Step 3: Super-Critic reviews (optional, for quality)
            if specialist_responses:
                critique_content = "Review these responses:\n\n" + "\n\n".join([
                    f"{k}: {v[:200]}..." for k, v in specialist_responses.items()
                ])
                
                critique_msg = Message(
                    id="msg_critique_request",
                    from_agent=AgentType.COORDINATOR,
                    to_agent=AgentType.SUPER_CRITIC,
                    content=critique_content,
                    type=MessageType.REQUEST,
                    timestamp=0,
                )
                critique = await self.super_critic.process_message(critique_msg)
            
            # Step 4: Coordinator synthesizes final answer
            final_answer = await self.coordinator.synthesize_final_answer(
                original_task=task,
                specialist_responses=specialist_responses,
            )
            
            # Store in memory
            agents_used = list(self.metrics_map.keys())
            await memory_manager.store_task_memory(
                task=task,
                final_answer=final_answer,
                agents_used=[str(a) for a in agents_used],
                metrics=list(self.metrics_map.values()),
                success=True,
            )
            
            # Return response
            return TaskResponse(
                task=task,
                messages=self.messages,
                metrics=list(self.metrics_map.values()),
                final_answer=final_answer,
                success=True,
            )
            
        except Exception as e:
            logger.error(f"Task processing failed: {e}")
            return TaskResponse(
                task=task,
                messages=self.messages,
                metrics=list(self.metrics_map.values()),
                final_answer="",
                success=False,
                error=str(e),
            )
    
    async def _delegate_to_specialist(
        self,
        agent,
        agent_type: AgentType,
        content: str,
        responses_dict: dict,
        key: str,
    ):
        """Delegate work to a specialist agent."""
        msg = Message(
            id=f"msg_delegate_{key}",
            from_agent=AgentType.COORDINATOR,
            to_agent=agent_type,
            content=content,
            type=MessageType.REQUEST,
            timestamp=0,
        )
        response = await agent.process_message(msg)
        if response:
            responses_dict[key] = response


# Global orchestrator instance
orchestrator = NeuroFabricOrchestrator()
