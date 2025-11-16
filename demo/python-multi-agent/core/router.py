"""
NeuroFabric cognitive router - orchestrates multi-agent collaboration
"""

import asyncio
import re
from typing import List, Dict, Any, Optional
from core.message import MessageBus, Message, Performative
from core.agent_base import Agent, load_agent_config
from core.logger import get_logger


class NeuroFabric:
    """
    Main orchestrator for the NeuroFabric cognitive framework.
    Manages agent lifecycle and coordinates complex task execution.
    """
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_agent_config(config_path)
        self.message_bus = MessageBus()
        self.agents: Dict[str, Agent] = {}
        self.tasks: List[asyncio.Task] = []
        self.result_queue: asyncio.Queue = asyncio.Queue()
        
        # Register fabric as a special subscriber for final results
        self.message_bus.subscribe("fabric", self._receive_result)
    
    def register_agent(self, agent: Agent):
        """Register an agent with the fabric"""
        self.agents[agent.agent_id] = agent
        logger = get_logger()
        logger.log_workflow("fabric", "REGISTER_AGENT", f"Registered: {agent.agent_id}")
    
    async def start(self):
        """Start all agents"""
        logger = get_logger()
        
        for agent in self.agents.values():
            task = asyncio.create_task(agent.run())
            self.tasks.append(task)
        
        logger.log_workflow("fabric", "FABRIC_STARTED", f"{len(self.agents)} agents active")
    
    async def stop(self):
        """Stop all agents"""
        logger = get_logger()
        
        for task in self.tasks:
            task.cancel()
        await asyncio.gather(*self.tasks, return_exceptions=True)
        
        logger.log_workflow("fabric", "FABRIC_STOPPED", "All agents stopped")
    
    async def _receive_result(self, message: Message):
        """Callback to receive final results from agents"""
        logger = get_logger()
        
        # Only queue INFORM messages (final results), ignore CONFIRM (acknowledgments)
        if message.performative == Performative.INFORM:
            logger.log_workflow("fabric", "RESULT_RECEIVED", f"From: {message.sender}")
            await self.result_queue.put(message)
    
    async def process(self, user_input: str, timeout: float = 90.0) -> str:
        """
        Process user input through the cognitive network.
        
        Flow:
        1. Send to Coordinator
        2. Coordinator decomposes and delegates to Specialists
        3. Analyst synthesizes specialist outputs
        4. Super-Critic validates quality
        5. Return final result
        """
        logger = get_logger()
        logger.log_workflow("fabric", "PROCESS_START", f"Timeout: {timeout}s")
        
        # Send initial request to Coordinator
        await self.message_bus.publish(Message(
            performative=Performative.REQUEST,
            sender="fabric",
            receiver="coordinator",
            content=user_input,
            summary="User task request"
        ))
        
        # Wait for final response (with timeout)
        try:
            result_message = await asyncio.wait_for(
                self.result_queue.get(),
                timeout=timeout
            )
            logger.log_workflow("fabric", "PROCESS_COMPLETE", "Result received")
            return result_message.content
                
        except asyncio.TimeoutError:
            logger.log_error("fabric", f"Processing timeout after {timeout}s")
            return "Processing timeout - cognitive network took too long"


class SimpleRouter:
    """
    Rule-based router for MVP.
    Future: Replace with vector-based semantic routing.
    """
    
    def __init__(self, config: dict):
        self.rules = config.get("routing", {}).get("rules", [])
    
    def route(self, content: str) -> List[str]:
        """
        Determine which specialists should handle a task.
        Returns list of specialist agent IDs.
        """
        specialists = []
        content_lower = content.lower()
        
        for rule in self.rules:
            pattern = rule.get("pattern", "")
            specialist = rule.get("specialist", "")
            
            if re.search(pattern, content_lower):
                specialists.append(specialist)
        
        # If no match, default to text specialist
        if not specialists:
            specialists.append("specialist_text")
        
        return list(set(specialists))  # Remove duplicates
