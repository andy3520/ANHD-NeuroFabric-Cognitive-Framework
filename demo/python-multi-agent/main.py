"""
NeuroFabric MVP Demo - Main Entry Point

Demonstrates a 5-agent cognitive network collaborating to solve tasks.
"""

import asyncio
import os
from dotenv import load_dotenv

from core.message import MessageBus
from core.router import NeuroFabric
from core.agent_base import load_agent_config
from core.logger import get_logger

from agents.coordinator import Coordinator
from agents.analyst import Analyst
from agents.specialist_math import SpecialistMath
from agents.specialist_text import SpecialistText
from agents.super_critic import SuperCritic


async def initialize_fabric():
    """Initialize NeuroFabric with all agents"""
    
    # Load configuration
    config = load_agent_config("config.yaml")
    
    # Create NeuroFabric orchestrator (it creates its own message_bus)
    fabric = NeuroFabric(config_path="config.yaml")
    message_bus = fabric.message_bus  # Use fabric's message_bus
    
    # Initialize agents
    coordinator = Coordinator(
        agent_id="coordinator",
        config=config["agents"]["coordinator"],
        message_bus=message_bus,
        fabric_config=config
    )
    
    analyst = Analyst(
        agent_id="analyst",
        config=config["agents"]["analyst"],
        message_bus=message_bus
    )
    
    math_specialist = SpecialistMath(
        agent_id="specialist_math",
        config=config["agents"]["specialist_math"],
        message_bus=message_bus
    )
    
    text_specialist = SpecialistText(
        agent_id="specialist_text",
        config=config["agents"]["specialist_text"],
        message_bus=message_bus
    )
    
    critic = SuperCritic(
        agent_id="super_critic",
        config=config["agents"]["super_critic"],
        message_bus=message_bus
    )
    
    # Register all agents
    fabric.register_agent(coordinator)
    fabric.register_agent(analyst)
    fabric.register_agent(math_specialist)
    fabric.register_agent(text_specialist)
    fabric.register_agent(critic)
    
    return fabric


async def run_demo():
    """Run the demo scenario"""
    
    # Initialize logger
    logger = get_logger(enable_debug=False)
    logger.start_session()
    
    # Initialize fabric and agents
    fabric = await initialize_fabric()
    
    # Start all agents
    await fabric.start()
    
    # Give agents time to initialize
    await asyncio.sleep(1)
    
    # Demo task: Customer review analysis
    demo_task = """
    Analyze these customer reviews and provide insights:
    
    Reviews:
    1. "Great product! Very satisfied. Rating: 5/5"
    2. "Decent quality but overpriced. Rating: 3/5"
    3. "Excellent service and fast delivery! Rating: 5/5"
    4. "Not what I expected, disappointed. Rating: 2/5"
    5. "Amazing value for money! Rating: 4/5"
    
    Calculate the average rating and analyze overall sentiment trends.
    """
    
    # Process through NeuroFabric
    result = await fabric.process(demo_task, timeout=90.0)
    
    print("\n" + "="*60)
    print("🎉 FINAL RESULT:")
    print("="*60)
    print(result)
    print("="*60 + "\n")
    
    # Stop the fabric
    await fabric.stop()
    
    # Print metrics summary
    logger.print_summary()


async def interactive_mode():
    """Interactive mode for testing custom inputs"""
    
    print("\n" + "="*60)
    print("🧠 NeuroFabric - Interactive Mode")
    print("="*60 + "\n")
    
    fabric = await initialize_fabric()
    await fabric.start()
    await asyncio.sleep(1)
    
    print("Enter your tasks (or 'quit' to exit):\n")
    
    while True:
        try:
            user_input = input("🎯 Task: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                break
            
            if not user_input:
                continue
            
            result = await fabric.process(user_input, timeout=15.0)
            
            print(f"\n{'='*60}")
            print("🎉 RESULT:")
            print(f"{'='*60}")
            print(result)
            print(f"{'='*60}\n")
            
        except KeyboardInterrupt:
            break
    
    await fabric.stop()
    print("\n👋 Goodbye!\n")


def main():
    """Main entry point"""
    
    # Load environment variables
    load_dotenv()
    
    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not found in environment")
        print("Set it with: export OPENAI_API_KEY='your-key-here'")
        return
    
    import sys
    mode = sys.argv[1] if len(sys.argv) > 1 else "demo"
    
    if mode == "interactive":
        asyncio.run(interactive_mode())
    else:
        asyncio.run(run_demo())


if __name__ == "__main__":
    main()
