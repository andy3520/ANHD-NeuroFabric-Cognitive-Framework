"""Message models for agent communication."""
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class MessageType(str, Enum):
    """Types of messages in the system."""
    REQUEST = "request"
    INFORM = "inform"
    QUERY = "query"
    RESPONSE = "response"
    COMMAND = "command"
    CONFIRM = "confirm"
    ERROR = "error"


class AgentType(str, Enum):
    """Types of agents in the system."""
    USER = "user"
    SYSTEM = "system"
    COORDINATOR = "coordinator"
    ANALYST = "analyst"
    SPECIALIST_MATH = "specialist_math"
    SPECIALIST_TEXT = "specialist_text"
    SUPER_CRITIC = "super_critic"
    TRADITIONAL = "traditional"


class Message(BaseModel):
    """Message structure for agent communication."""
    id: str = Field(..., description="Unique message identifier")
    from_agent: AgentType = Field(..., alias="from", description="Sender agent")
    to_agent: AgentType = Field(..., alias="to", description="Recipient agent")
    content: str = Field(..., description="Message content")
    type: MessageType = Field(..., description="Message type")
    timestamp: int = Field(..., description="Unix timestamp in milliseconds")
    parent_message_id: Optional[str] = Field(None, description="Parent message ID for threading")
    from_instance_id: Optional[str] = Field(None, description="Sender instance identifier")
    to_instance_id: Optional[str] = Field(None, description="Recipient instance identifier")

    class Config:
        populate_by_name = True
        use_enum_values = True
