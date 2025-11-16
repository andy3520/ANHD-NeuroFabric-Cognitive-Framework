"""
Enhanced logging system for NeuroFabric
Tracks message flow, agent interactions, and resource usage
"""

import time
from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WORKFLOW = "WORKFLOW"
    METRICS = "METRICS"
    ERROR = "ERROR"


@dataclass
class AgentMetrics:
    """Track metrics for individual agents"""
    agent_id: str
    llm_calls: int = 0
    total_tokens: int = 0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_cost_usd: float = 0.0
    processing_time: float = 0.0
    messages_sent: int = 0
    messages_received: int = 0


@dataclass
class WorkflowStep:
    """Track individual workflow steps"""
    timestamp: datetime
    step_number: int
    agent: str
    action: str
    details: str
    duration_ms: Optional[float] = None


class NeuroFabricLogger:
    """
    Comprehensive logging system for NeuroFabric.
    
    Tracks:
    - Message flow between agents
    - Token usage and costs
    - Processing times
    - Workflow execution steps
    """
    
    def __init__(self, enable_debug: bool = False):
        self.enable_debug = enable_debug
        self.agent_metrics: Dict[str, AgentMetrics] = {}
        self.workflow_steps: List[WorkflowStep] = []
        self.start_time: float = 0
        self.step_counter: int = 0
        
    def start_session(self):
        """Start a new processing session"""
        self.start_time = time.time()
        self.agent_metrics.clear()
        self.workflow_steps.clear()
        self.step_counter = 0
        self._log_header()
    
    def _log_header(self):
        """Print session header"""
        print("\n" + "="*80)
        print("🧠 ANHD-NeuroFabric Cognitive Framework - Processing Session")
        print("="*80 + "\n")
    
    def log_workflow(self, agent: str, action: str, details: str = "", duration_ms: Optional[float] = None):
        """Log a workflow step"""
        self.step_counter += 1
        step = WorkflowStep(
            timestamp=datetime.now(),
            step_number=self.step_counter,
            agent=agent,
            action=action,
            details=details,
            duration_ms=duration_ms
        )
        self.workflow_steps.append(step)
        
        # Format output
        time_str = step.timestamp.strftime("%H:%M:%S.%f")[:-3]
        duration_str = f" ({duration_ms:.0f}ms)" if duration_ms else ""
        
        print(f"[{time_str}] Step {self.step_counter:02d} | {agent:20s} | {action:30s}{duration_str}")
        if details and self.enable_debug:
            print(f"           └─ {details}")
    
    def log_message(self, sender: str, receiver: str, performative: str, summary: str):
        """Log message between agents"""
        if receiver == "fabric":
            icon = "🎯"
        else:
            icon = "📨"
        
        self._ensure_agent_metrics(sender)
        self._ensure_agent_metrics(receiver)
        
        self.agent_metrics[sender].messages_sent += 1
        if receiver != "fabric":
            self.agent_metrics[receiver].messages_received += 1
        
        print(f"{icon} [{performative}] {sender} → {receiver}: {summary}")
    
    def log_llm_call(self, agent: str, model: str, prompt_tokens: int = 0, 
                     completion_tokens: int = 0, duration_ms: float = 0):
        """Log LLM API call with token usage"""
        self._ensure_agent_metrics(agent)
        
        metrics = self.agent_metrics[agent]
        metrics.llm_calls += 1
        metrics.prompt_tokens += prompt_tokens
        metrics.completion_tokens += completion_tokens
        metrics.total_tokens += (prompt_tokens + completion_tokens)
        metrics.processing_time += duration_ms / 1000
        
        # Estimate cost (OpenAI GPT-4o-mini pricing as of 2024)
        # $0.15 per 1M input tokens, $0.60 per 1M output tokens
        cost = (prompt_tokens * 0.15 / 1_000_000) + (completion_tokens * 0.60 / 1_000_000)
        metrics.total_cost_usd += cost
        
        print(f"🔄 [{agent}] LLM Call: {model} | Tokens: {prompt_tokens}→{completion_tokens} | "
              f"Time: {duration_ms:.0f}ms | Cost: ${cost:.6f}")
    
    def log_error(self, agent: str, error: str):
        """Log error"""
        print(f"❌ [{agent}] ERROR: {error}")
    
    def _ensure_agent_metrics(self, agent_id: str):
        """Ensure metrics object exists for agent"""
        if agent_id not in self.agent_metrics:
            self.agent_metrics[agent_id] = AgentMetrics(agent_id=agent_id)
    
    def print_summary(self):
        """Print session summary with metrics"""
        total_time = time.time() - self.start_time
        
        print("\n" + "="*80)
        print("📊 SESSION SUMMARY")
        print("="*80 + "\n")
        
        print(f"⏱️  Total Processing Time: {total_time:.2f}s")
        print(f"📝 Workflow Steps: {len(self.workflow_steps)}")
        print()
        
        # Agent metrics
        print("🤖 Agent Metrics:")
        print("-" * 80)
        print(f"{'Agent':<20} {'LLM Calls':<12} {'Tokens':<15} {'Cost (USD)':<12} {'Msgs Sent':<10}")
        print("-" * 80)
        
        total_tokens = 0
        total_cost = 0.0
        
        for agent_id in sorted(self.agent_metrics.keys()):
            metrics = self.agent_metrics[agent_id]
            total_tokens += metrics.total_tokens
            total_cost += metrics.total_cost_usd
            
            print(f"{agent_id:<20} {metrics.llm_calls:<12} "
                  f"{metrics.total_tokens:<15,} "
                  f"${metrics.total_cost_usd:<11.6f} {metrics.messages_sent:<10}")
        
        print("-" * 80)
        print(f"{'TOTAL':<20} {'':<12} {total_tokens:<15,} ${total_cost:<11.6f}")
        print()
        
        # Cost efficiency analysis
        if total_tokens > 0:
            cost_per_1k_tokens = (total_cost / total_tokens) * 1000
            print(f"💰 Cost Efficiency:")
            print(f"   - Average: ${cost_per_1k_tokens:.4f} per 1K tokens")
            print(f"   - Processing rate: {total_tokens / total_time:.0f} tokens/second")
            print()
        
        # Workflow visualization
        print("🔄 Workflow Execution:")
        print("-" * 80)
        agent_order = []
        for step in self.workflow_steps:
            if step.agent not in agent_order:
                agent_order.append(step.agent)
        
        print("   " + " → ".join(agent_order))
        print()
        
        print("="*80 + "\n")


# Global logger instance
_global_logger: Optional[NeuroFabricLogger] = None


def get_logger(enable_debug: bool = False) -> NeuroFabricLogger:
    """Get or create global logger instance"""
    global _global_logger
    if _global_logger is None:
        _global_logger = NeuroFabricLogger(enable_debug=enable_debug)
    return _global_logger


def reset_logger():
    """Reset global logger"""
    global _global_logger
    _global_logger = None
