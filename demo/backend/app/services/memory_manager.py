"""Simple memory manager for task history and learnings."""
import json
import os
from typing import Optional, List
from datetime import datetime
from pathlib import Path
from ..core.logger import get_logger
from ..models import AgentMetrics

logger = get_logger(__name__)


class MemoryManager:
    """Simple file-based memory manager."""
    
    def __init__(self, memory_dir: str = "memory"):
        """Initialize memory manager."""
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(exist_ok=True)
        self.consolidated_file = self.memory_dir / "consolidated_memory.json"
        self._ensure_memory_file()
    
    def _ensure_memory_file(self):
        """Ensure memory file exists."""
        if not self.consolidated_file.exists():
            self._save_memories([])
    
    def _load_memories(self) -> List[dict]:
        """Load memories from file."""
        try:
            with open(self.consolidated_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load memories: {e}")
            return []
    
    def _save_memories(self, memories: List[dict]):
        """Save memories to file."""
        try:
            with open(self.consolidated_file, 'w') as f:
                json.dump(memories, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save memories: {e}")
    
    async def store_task_memory(
        self,
        task: str,
        final_answer: str,
        agents_used: List[str],
        metrics: List[AgentMetrics],
        success: bool = True,
    ):
        """
        Store a completed task in memory.
        
        Args:
            task: The original task
            final_answer: The solution/answer
            agents_used: List of agent IDs that worked on this
            metrics: Performance metrics
            success: Whether task completed successfully
        """
        memories = self._load_memories()
        
        # Calculate totals
        total_tokens = sum(m.tokens.total for m in metrics)
        total_cost = sum(m.cost for m in metrics)
        total_time = sum(m.processing_time for m in metrics)
        
        # Create memory entry
        memory = {
            "id": f"task_{int(datetime.now().timestamp())}",
            "task": task,
            "task_length": len(task),
            "final_answer": final_answer[:500],  # Store first 500 chars
            "agents_used": agents_used,
            "success": success,
            "metrics": {
                "total_tokens": total_tokens,
                "total_cost": round(total_cost, 6),
                "total_time_ms": total_time,
            },
            "timestamp": datetime.now().isoformat(),
        }
        
        # Add to memories (keep last 100)
        memories.append(memory)
        memories = memories[-100:]  # Keep only recent 100
        
        self._save_memories(memories)
        logger.info(f"Stored task memory: {memory['id']}")
    
    async def retrieve_similar_tasks(
        self,
        task: str,
        limit: int = 3,
    ) -> List[dict]:
        """
        Retrieve similar tasks (simple keyword matching).
        
        Args:
            task: Current task to find similar ones
            limit: Max number of results
        
        Returns:
            List of similar task memories
        """
        memories = self._load_memories()
        
        if not memories:
            return []
        
        # Simple keyword-based similarity
        task_lower = task.lower()
        keywords = set(task_lower.split())
        
        # Score each memory
        scored_memories = []
        for memory in memories:
            if not memory.get("success", True):
                continue  # Skip failed tasks
            
            memory_task = memory.get("task", "").lower()
            memory_keywords = set(memory_task.split())
            
            # Calculate simple overlap score
            overlap = len(keywords & memory_keywords)
            if overlap > 0:
                score = overlap / len(keywords)
                scored_memories.append((score, memory))
        
        # Sort by score and return top matches
        scored_memories.sort(reverse=True, key=lambda x: x[0])
        similar = [m for _, m in scored_memories[:limit]]
        
        if similar:
            logger.info(f"Found {len(similar)} similar tasks")
        
        return similar
    
    async def get_task_stats(self) -> dict:
        """Get statistics about stored tasks."""
        memories = self._load_memories()
        
        if not memories:
            return {
                "total_tasks": 0,
                "successful_tasks": 0,
                "avg_cost": 0,
                "avg_time_ms": 0,
                "total_tokens": 0,
            }
        
        successful = [m for m in memories if m.get("success", True)]
        
        return {
            "total_tasks": len(memories),
            "successful_tasks": len(successful),
            "avg_cost": sum(m["metrics"]["total_cost"] for m in successful) / len(successful) if successful else 0,
            "avg_time_ms": sum(m["metrics"]["total_time_ms"] for m in successful) / len(successful) if successful else 0,
            "total_tokens": sum(m["metrics"]["total_tokens"] for m in successful),
        }
    
    async def clear_old_memories(self, keep_last: int = 50):
        """Clear old memories, keeping only recent ones."""
        memories = self._load_memories()
        memories = memories[-keep_last:]
        self._save_memories(memories)
        logger.info(f"Cleared old memories, kept last {keep_last}")


# Global memory manager instance
memory_manager = MemoryManager()
