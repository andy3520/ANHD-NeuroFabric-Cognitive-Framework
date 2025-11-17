"""API endpoints for task processing."""
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from ..models import TaskRequest, TaskResponse, StreamEvent, Message, AgentMetrics
from ..services import orchestrator
from ..core.logger import get_logger
import asyncio
import json

logger = get_logger(__name__)
router = APIRouter(prefix="/api", tags=["tasks"])


@router.post("/process", response_model=TaskResponse)
async def process_task(request: TaskRequest) -> TaskResponse:
    """
    Process a task through the NeuroFabric multi-agent system.
    
    This is the non-streaming endpoint that returns the complete result.
    """
    logger.info(f"Processing task: {request.task[:100]}...")
    
    try:
        result = await orchestrator.process_task(request.task)
        return result
    except Exception as e:
        logger.error(f"Task processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process/stream")
async def process_task_stream(request: TaskRequest):
    """
    Process a task with streaming updates via Server-Sent Events (SSE).
    
    Events emitted:
    - message: New agent communication
    - metric: Agent metric update
    - answer: Final answer ready
    - done: Processing complete
    - error: An error occurred
    """
    async def event_generator():
        """Generate SSE events during task processing."""
        messages_sent = set()
        metrics_sent = {}
        
        # Setup callbacks
        async def on_message(message: Message):
            if message.id not in messages_sent:
                messages_sent.add(message.id)
                event = StreamEvent(
                    type="message",
                    data=message.dict(by_alias=True)
                )
                yield {
                    "event": "message",
                    "data": json.dumps(event.data)
                }
        
        async def on_metric(metric: AgentMetrics):
            # Only send if changed
            key = str(metric.agent_id)
            if metrics_sent.get(key) != metric.dict():
                metrics_sent[key] = metric.dict()
                event = StreamEvent(
                    type="metric",
                    data=metric.dict()
                )
                yield {
                    "event": "metric",
                    "data": json.dumps(event.data)
                }
        
        orchestrator.set_message_callback(on_message)
        orchestrator.set_metric_callback(on_metric)
        
        try:
            # Process task
            result = await orchestrator.process_task(request.task)
            
            # Send final answer
            if result.success:
                answer_event = StreamEvent(
                    type="answer",
                    data={"answer": result.final_answer}
                )
                yield {
                    "event": "answer",
                    "data": json.dumps(answer_event.data)
                }
                
                # Send done event
                done_event = StreamEvent(
                    type="done",
                    data={"success": True}
                )
                yield {
                    "event": "done",
                    "data": json.dumps(done_event.data)
                }
            else:
                # Send error event
                error_event = StreamEvent(
                    type="error",
                    data={"error": result.error or "Unknown error"}
                )
                yield {
                    "event": "error",
                    "data": json.dumps(error_event.data)
                }
        
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            error_event = StreamEvent(
                type="error",
                data={"error": str(e)}
            )
            yield {
                "event": "error",
                "data": json.dumps(error_event.data)
            }
    
    return EventSourceResponse(event_generator())


@router.post("/process/traditional", response_model=TaskResponse)
async def process_traditional(request: TaskRequest) -> TaskResponse:
    """
    Process task using traditional single-model approach (for comparison).
    
    Uses a single GPT-4 call with full context to demonstrate the difference
    in cost and performance vs the multi-agent approach.
    """
    logger.info(f"Processing task (traditional): {request.task[:100]}...")
    
    try:
        from ..services import llm_service
        from ..models import Message, MessageType, AgentType, AgentMetrics, TokenUsage
        import time
        
        start_time = time.time()
        
        # Single LLM call with full context
        messages = [
            {
                "role": "system",
                "content": "You are a helpful AI assistant. Provide comprehensive, detailed answers."
            },
            {
                "role": "user",
                "content": request.task
            }
        ]
        
        response, tokens, cost, llm_time = await llm_service.chat_completion(
            messages=messages,
            model="gpt-4-turbo-preview",
        )
        
        total_time = int((time.time() - start_time) * 1000)
        
        # Create mock messages for comparison
        user_msg = Message(
            id="msg_user",
            from_agent=AgentType.USER,
            to_agent=AgentType.TRADITIONAL,
            content=request.task,
            type=MessageType.REQUEST,
            timestamp=int(time.time() * 1000),
        )
        
        ai_msg = Message(
            id="msg_ai",
            from_agent=AgentType.TRADITIONAL,
            to_agent=AgentType.USER,
            content=response,
            type=MessageType.RESPONSE,
            timestamp=int(time.time() * 1000),
        )
        
        # Create metrics
        metrics = AgentMetrics(
            agent_id=AgentType.TRADITIONAL,
            llm_calls=1,
            tokens=tokens,
            cost=cost,
            messages_sent=1,
            processing_time=total_time,
            status="done",
        )
        
        return TaskResponse(
            task=request.task,
            messages=[user_msg, ai_msg],
            metrics=[metrics],
            final_answer=response,
            success=True,
        )
    
    except Exception as e:
        logger.error(f"Traditional processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "neurofabric-api"}
