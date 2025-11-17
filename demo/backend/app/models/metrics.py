"""Metrics models for agent performance tracking."""
from typing import Optional
from pydantic import BaseModel, Field
from .message import AgentType


class TokenUsage(BaseModel):
    """Token usage breakdown."""
    prompt: int = Field(0, description="Prompt tokens used")
    completion: int = Field(0, description="Completion tokens used")
    total: int = Field(0, description="Total tokens used")


class AgentMetrics(BaseModel):
    """Performance metrics for an agent."""
    agent_id: AgentType = Field(..., description="Agent identifier")
    llm_calls: int = Field(0, description="Number of LLM API calls")
    tokens: TokenUsage = Field(default_factory=TokenUsage, description="Token usage")
    cost: float = Field(0.0, description="Estimated cost in USD")
    messages_sent: int = Field(0, description="Number of messages sent")
    processing_time: int = Field(0, description="Processing time in milliseconds")
    status: str = Field("idle", description="Current status: idle, thinking, done, error")

    class Config:
        use_enum_values = True


class PerformanceMetrics(BaseModel):
    """Overall performance metrics."""
    total_time: float = Field(..., description="Total processing time in seconds")
    total_cost: float = Field(..., description="Total cost in USD")
    total_tokens: int = Field(..., description="Total tokens used")
    processing_rate: float = Field(..., description="Tokens per second")
    agent_metrics: list[AgentMetrics] = Field(default_factory=list, description="Individual agent metrics")
