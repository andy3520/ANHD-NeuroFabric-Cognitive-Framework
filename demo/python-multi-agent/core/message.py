"""
FIPA-ACL Inspired Message Protocol for NeuroFabric
Based on FIPA ACL Message Structure Specification (2002)
"""

from typing import Optional, List, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime
import uuid


class Performative(str, Enum):
    """FIPA-ACL performatives adapted for cognitive agents"""
    REQUEST = "REQUEST"          # Request action from another agent
    INFORM = "INFORM"            # Share information/results
    PROPOSE = "PROPOSE"          # Suggest solution or approach
    CONFIRM = "CONFIRM"          # Confirm receipt or agreement
    EVALUATE = "EVALUATE"        # Request quality assessment
    QUERY = "QUERY"              # Ask for information
    REJECT = "REJECT"            # Reject proposal or result


class Message(BaseModel):
    """
    Hybrid message structure for NeuroFabric agents.
    
    Three layers:
    1. Control Layer: FIPA-style performatives and routing
    2. Semantic Layer: Optional vector embeddings (future)
    3. Summary Layer: Human-readable description
    """
    
    # Control Layer
    performative: Performative
    sender: str
    receiver: str
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reply_to: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Content
    content: str
    metadata: dict = Field(default_factory=dict)
    
    # Semantic Layer (optional, for future vector routing)
    embedding: Optional[List[float]] = None
    
    # Summary Layer
    summary: str = ""
    
    def __str__(self):
        return f"[{self.performative}] {self.sender} → {self.receiver}: {self.summary or self.content[:50]}"


class MessageBus:
    """
    Simple in-memory message router for MVP.
    Future: Replace with Redis/MQTT for distributed deployment.
    """
    
    def __init__(self):
        self.messages: List[Message] = []
        self.subscribers: dict = {}
    
    def subscribe(self, agent_id: str, callback):
        """Register agent to receive messages"""
        self.subscribers[agent_id] = callback
    
    async def publish(self, message: Message):
        """Send message to recipient"""
        self.messages.append(message)
        
        # Deliver to recipient
        if message.receiver in self.subscribers:
            callback = self.subscribers[message.receiver]
            await callback(message)
        elif message.receiver not in ["user", "fabric"]:
            # Only warn for unexpected receivers (not user or fabric)
            print(f"⚠️  No subscriber for {message.receiver}")
        elif message.receiver == "fabric":
            # Debug: fabric should be subscribed but isn't
            print(f"⚠️  Fabric is not in subscribers! Available: {list(self.subscribers.keys())}")
    
    def get_conversation(self, message_id: str) -> List[Message]:
        """Retrieve conversation thread"""
        thread = []
        current_id = message_id
        
        while current_id:
            msg = next((m for m in self.messages if m.message_id == current_id), None)
            if msg:
                thread.insert(0, msg)
                current_id = msg.reply_to
            else:
                break
        
        return thread
