"""
Coordinator Agent - The prefrontal cortex of NeuroFabric
Decomposes goals, delegates tasks, and synthesizes final outputs
"""

from typing import Optional
from core.agent_base import Agent
from core.message import Message, Performative
from core.router import SimpleRouter
from core.logger import get_logger


class Coordinator(Agent):
    """
    Coordinator orchestrates the cognitive workflow.
    
    Responsibilities:
    - Decompose complex goals into subtasks
    - Route subtasks to appropriate specialists
    - Monitor progress
    - Produce final output
    """
    
    def __init__(self, agent_id: str, config: dict, message_bus, fabric_config: dict):
        super().__init__(agent_id, config, message_bus)
        self.router = SimpleRouter(fabric_config)
        self.pending_tasks = {}  # Track delegated tasks
    
    async def process(self, message: Message) -> Optional[Message]:
        """Process incoming requests and coordinate responses"""
        
        if message.performative == Performative.REQUEST:
            return await self.handle_user_request(message)
        
        elif message.performative == Performative.INFORM:
            return await self.handle_specialist_response(message)
        
        return None
    
    async def handle_user_request(self, message: Message) -> Message:
        """Decompose user request and delegate to specialists"""
        
        logger = get_logger()
        logger.log_workflow(self.agent_id, "DECOMPOSE_TASK", "Analyzing user request")
        
        # Use LLM to analyze and decompose the task
        decomposition_prompt = f"""
        Analyze this user request and break it into clear subtasks:
        
        USER REQUEST: {message.content}
        
        Respond with:
        1. A brief analysis of what's needed
        2. List of specific subtasks (be concrete and actionable)
        
        Keep it concise.
        """
        
        analysis = await self.call_llm(decomposition_prompt)
        
        # Route to appropriate specialists
        specialists = self.router.route(message.content)
        logger.log_workflow(self.agent_id, "ROUTE_TO_SPECIALISTS", f"Routing to: {', '.join(specialists)}")
        
        # Track this task
        self.pending_tasks[message.message_id] = {
            "original_request": message.content,
            "specialists": specialists,
            "responses": {},
            "requester": message.sender
        }
        
        # Delegate to specialists
        for specialist_id in specialists:
            await self.send_message(
                receiver=specialist_id,
                content=message.content,
                performative=Performative.REQUEST,
                reply_to=message.message_id,
                summary=f"Subtask delegation to {specialist_id}"
            )
        
        # Send acknowledgment to fabric
        return await self.send_message(
            receiver=message.sender,
            content=f"Processing your request with {len(specialists)} specialists...",
            performative=Performative.CONFIRM,
            reply_to=message.message_id,
            summary="Request acknowledged"
        )
    
    async def handle_specialist_response(self, message: Message) -> Optional[Message]:
        """Collect specialist responses and synthesize when complete"""
        
        logger = get_logger()
        task_id = message.reply_to
        if not task_id or task_id not in self.pending_tasks:
            logger.log_error(self.agent_id, f"Unknown task ID: {task_id}")
            return None
        
        task_data = self.pending_tasks[task_id]
        task_data["responses"][message.sender] = message.content
        
        progress = f"{len(task_data['responses'])}/{len(task_data['specialists'])}"
        logger.log_workflow(self.agent_id, "COLLECT_RESPONSE", f"Progress: {progress}")
        
        # Check if all specialists have responded
        if len(task_data["responses"]) == len(task_data["specialists"]):
            logger.log_workflow(self.agent_id, "ALL_RESPONSES_READY", "Sending to Analyst")
            
            # Send to Analyst for synthesis
            synthesis_request = f"""
            ORIGINAL REQUEST: {task_data['original_request']}
            
            SPECIALIST RESPONSES:
            {self._format_responses(task_data['responses'])}
            
            Please synthesize these findings into a coherent response.
            """
            
            await self.send_message(
                receiver="analyst",
                content=synthesis_request,
                performative=Performative.REQUEST,
                reply_to=task_id,
                summary="Request synthesis from Analyst"
            )
            
            # Clean up
            del self.pending_tasks[task_id]
        
        return None
    
    def _format_responses(self, responses: dict) -> str:
        """Format specialist responses for synthesis"""
        formatted = []
        for specialist, response in responses.items():
            formatted.append(f"[{specialist}]:\n{response}\n")
        return "\n".join(formatted)
