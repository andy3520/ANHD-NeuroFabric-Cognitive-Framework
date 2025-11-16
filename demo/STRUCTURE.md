# Demo Directory Structure

This directory contains demonstration implementations of the ANHD-NeuroFabric Cognitive Framework.

## Organization

```
demo/
├── README.md                    # Overview of all demos
├── .gitignore                   # Git ignore rules for demos
├── STRUCTURE.md                 # This file
│
├── python-multi-agent/          # Multi-agent Python implementation
│   ├── README.md                # Detailed documentation
│   ├── .gitignore               # Python-specific ignores
│   ├── .env.example             # Environment template
│   ├── requirements.txt         # Python dependencies
│   ├── config.yaml              # Agent configuration
│   ├── main.py                  # Entry point
│   │
│   ├── agents/                  # Agent implementations
│   │   ├── coordinator.py       # Task decomposition
│   │   ├── analyst.py           # Result synthesis
│   │   ├── specialist_math.py   # Math specialist
│   │   ├── specialist_text.py   # Text specialist
│   │   └── super_critic.py      # Quality control
│   │
│   └── core/                    # Core framework
│       ├── agent_base.py        # Base agent class
│       ├── message.py           # Message protocol
│       ├── router.py            # Orchestration
│       └── logger.py            # Logging & metrics
│
└── examples/                    # Example scripts
    └── customer_analysis.py     # Analysis example
```

## Quick Start

### Python Multi-Agent Demo

```bash
cd python-multi-agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
python main.py
```

## Adding New Demos

When creating a new demo:

1. Create a subdirectory: `demo/your-demo-name/`
2. Include standard files:
   - `README.md` - Setup and usage
   - `.gitignore` - Exclude temp files
   - `.env.example` - Config template
   - Requirements file (requirements.txt, package.json, etc.)
3. Update `demo/README.md` with link to your demo
4. Follow the demo standards (see main README)

## Standards

Each demo should:
- Be self-contained with its own dependencies
- Include comprehensive documentation
- Provide example output/screenshots
- Follow consistent structure
- Exclude sensitive data via .gitignore
- Be independently runnable

## License

CC BY-NC 4.0 - See [LICENSE.md](../LICENSE.md)
