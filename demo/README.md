# NeuroFabric Demos

Demonstration implementations of the ANHD-NeuroFabric Cognitive Framework.

## Available Demos

### [Python Multi-Agent Demo](./python-multi-agent/)

A complete working implementation featuring:
- 5 specialized agents (Coordinator, Analyst, Specialists, Super-Critic)
- Message-based multi-agent collaboration
- Comprehensive logging and metrics
- Token usage and cost tracking
- Customer review analysis example

**Quick Start:**
```bash
cd python-multi-agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Configure .env with your OPENAI_API_KEY
python main.py
```

See [python-multi-agent/README.md](./python-multi-agent/README.md) for detailed documentation.

---

## Adding New Demos

When creating new demonstration implementations:

1. Create a new directory under `demo/`
2. Include a README.md with setup and usage instructions
3. Add a .gitignore to exclude sensitive files
4. Update this file with a link to your demo

## Demo Standards

Each demo should include:
- **README.md**: Setup, usage, and documentation
- **.gitignore**: Exclude virtual environments, logs, secrets
- **.env.example**: Template for required environment variables
- **requirements.txt** or equivalent dependency file
- Clear architecture documentation
- Example output/screenshots

## License

All demos are shared under CC BY-NC 4.0 - See [LICENSE.md](../LICENSE.md)
