# Python Multi-Agent Demo

A working implementation of the ANHD-NeuroFabric Cognitive Framework demonstrating multi-agent collaboration with comprehensive logging and metrics.

## Features

- **5 Specialized Agents**: Coordinator, Analyst, Math Specialist, Text Specialist, Super-Critic
- **Message-Based Communication**: FIPA-ACL inspired protocol
- **Comprehensive Logging**: Workflow tracking, token usage, cost analysis
- **Real-time Metrics**: Processing time, token efficiency, cost per operation

## Architecture

```
User Input
    ↓
Coordinator (decomposes task)
    ↓
[Math Specialist] + [Text Specialist] (parallel execution)
    ↓
Analyst (synthesizes results)
    ↓
Super-Critic (validates quality)
    ↓
Final Output
```

## Prerequisites

- Python 3.10 or higher
- OpenAI API key (or compatible LLM provider)

## Installation

```bash
# Navigate to this directory
cd python-multi-agent

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure your API key
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=your-api-key-here
```

## Usage

### Run the Demo

```bash
# Activate the virtual environment (if not already active)
source venv/bin/activate

# Run the demo
python main.py

# When done, deactivate the virtual environment
deactivate
```

### Expected Output

The demo analyzes customer reviews and provides:
- Average rating calculation
- Sentiment analysis
- Key insights and trends
- Comprehensive metrics report

**Example metrics:**
- Total tokens: ~5,000
- Total cost: ~$0.002 (0.2 cents)
- Processing time: ~30-40 seconds
- Token efficiency: $0.0003 per 1K tokens

## Configuration

Edit `config.yaml` to customize:
- LLM provider and models
- Agent personalities and capabilities
- Message routing rules
- Temperature and other parameters

## Project Structure

```
python-multi-agent/
├── agents/              # Agent implementations
│   ├── coordinator.py   # Task decomposition & routing
│   ├── analyst.py       # Result synthesis
│   ├── specialist_math.py
│   ├── specialist_text.py
│   └── super_critic.py  # Quality validation
├── core/                # Core framework
│   ├── agent_base.py    # Base agent class
│   ├── message.py       # Message protocol
│   ├── router.py        # NeuroFabric orchestrator
│   └── logger.py        # Logging & metrics
├── config.yaml          # Configuration
├── main.py              # Entry point
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Logging & Metrics

The framework provides detailed logging including:

### Workflow Steps
- Timestamped execution steps
- Duration for each operation
- Agent interactions and message flow

### Token Usage
- Prompt and completion tokens per agent
- Total token consumption
- Cost calculation (OpenAI pricing)

### Performance Metrics
- Total processing time
- Tokens per second
- Cost per 1K tokens
- Workflow execution path

### Example Summary Output

```
================================================================================
📊 SESSION SUMMARY
================================================================================

⏱️  Total Processing Time: 32.99s
📝 Workflow Steps: 32

🤖 Agent Metrics:
--------------------------------------------------------------------------------
Agent                LLM Calls    Tokens          Cost (USD)   Msgs Sent 
--------------------------------------------------------------------------------
analyst              1            2,076           $0.000593    3         
coordinator          1            429             $0.000152    7         
specialist_math      1            837             $0.000401    2         
specialist_text      1            797             $0.000372    2         
super_critic         1            872             $0.000156    2         
--------------------------------------------------------------------------------
TOTAL                             5,011           $0.001675   

💰 Cost Efficiency:
   - Average: $0.0003 per 1K tokens
   - Processing rate: 152 tokens/second
```

## Troubleshooting

### API Key Issues
- Ensure `.env` file exists with `OPENAI_API_KEY=your-key-here`
- Check that the virtual environment is activated

### Import Errors
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version: `python --version` (should be 3.10+)

### Timeout Issues
- Increase timeout in `main.py`: `fabric.process(demo_task, timeout=120.0)`
- Check internet connection for LLM API calls

## Advanced Usage

### Custom Tasks

```python
from core.router import NeuroFabric

async def custom_task():
    fabric = NeuroFabric()
    # ... initialize agents ...
    
    result = await fabric.process(
        "Your custom task here",
        timeout=60.0
    )
    print(result)
```

### Debug Mode

Enable debug logging to see detailed execution:

```python
from core.logger import get_logger

logger = get_logger(enable_debug=True)
logger.start_session()
```

## License

CC BY-NC 4.0 - See [LICENSE.md](../../LICENSE.md)

## Related Documentation

- [Main README](../../README.md) - Project overview
- [WHITEPAPER](../../WHITEPAPER.md) - Theoretical foundation
- [ROADMAP](../../ROADMAP.md) - Future development plans
