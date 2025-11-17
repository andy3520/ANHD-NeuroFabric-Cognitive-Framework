"""Task models for request/response."""
from typing import Optional
from pydantic import BaseModel, Field
from .message import Message
from .metrics import AgentMetrics


class TaskRequest(BaseModel):
    """Request to process a task."""
    task: str = Field(..., description="Task description to process", min_length=1)
    stream: bool = Field(True, description="Enable streaming responses")


class TaskResponse(BaseModel):
    """Response after processing a task."""
    task: str = Field(..., description="Original task")
    messages: list[Message] = Field(default_factory=list, description="Communication messages")
    metrics: list[AgentMetrics] = Field(default_factory=list, description="Agent performance metrics")
    final_answer: str = Field(..., description="Final synthesized answer")
    success: bool = Field(True, description="Whether task completed successfully")
    error: Optional[str] = Field(None, description="Error message if failed")


class StreamEvent(BaseModel):
    """Event sent during streaming."""
    type: str = Field(..., description="Event type: message, metric, answer, done, error")
    data: dict = Field(..., description="Event data")
