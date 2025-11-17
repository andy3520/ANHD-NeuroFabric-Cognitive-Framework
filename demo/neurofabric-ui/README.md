# NeuroFabric UI

> **Beautiful, Interactive Dashboard for Multi-Agent AI Visualization**

A modern Next.js web application that visualizes the ANHD-NeuroFabric Cognitive Framework in action. Watch AI agents collaborate in real-time and compare multi-agent vs traditional AI approaches.

## 🎨 Features (In Development)

### ✅ Completed
- [x] Next.js 14 + TypeScript + Tailwind CSS setup
- [x] shadcn/ui component library integration
- [x] Design system (colors, typography, agent branding)
- [x] State management with Zustand
- [x] Type definitions for agents, messages, metrics
- [x] Example task templates
- [x] Basic layout and navigation

### 🚧 In Progress
- [ ] 3D Agent Network Visualization (react-force-graph-3d)
- [ ] Real-time Chat Interface
- [ ] Live Metrics Dashboard
- [ ] Side-by-Side Comparison Mode
- [ ] WebSocket connection to Python backend
- [ ] Message flow animations
- [ ] Export functionality (PDF, JSON, PNG)

### 📋 Planned
- [ ] Configuration UI panel
- [ ] Session history management
- [ ] Mobile responsive design
- [ ] Dark/light theme toggle
- [ ] Performance optimizations
- [ ] Documentation

## 🚀 Quick Start

```bash
# Navigate to UI directory
cd demo/neurofabric-ui

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📁 Project Structure

```
neurofabric-ui/
├── app/                    # Next.js app router
│   ├── api/               # API routes (future WebSocket)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── chat/              # Chat interface (planned)
│   ├── graph/             # 3D network graph (planned)
│   ├── metrics/           # Metrics dashboard (planned)
│   └── comparison/        # Side-by-side view (planned)
├── lib/
│   ├── constants.ts       # Design system, colors, examples
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Utility functions
├── store/
│   └── useSessionStore.ts # Zustand state management
└── public/                # Static assets
```

## 🎨 Design System

### Agent Colors
- **Coordinator**: Purple `#8b5cf6`
- **Analyst**: Blue `#3b82f6`
- **Math Specialist**: Green `#10b981`
- **Text Specialist**: Orange `#f59e0b`
- **Super-Critic**: Red `#ef4444`
- **Traditional AI**: Indigo `#6366f1`

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **3D Graphics**: react-force-graph-3d + Three.js
- **Charts**: Recharts
- **Animation**: Framer Motion
- **State**: Zustand
- **Real-time**: Socket.IO (planned)

## 🔌 Backend Integration (Planned)

The UI will connect to the Python backend via:
1. **REST API**: Configuration, session management
2. **WebSocket**: Real-time agent messages, metrics updates

```
Python Backend                    Next.js Frontend
├── WebSocket Server      ←→      ├── Socket.IO Client
├── REST Endpoints        ←→      ├── API Routes
└── NeuroFabric Core              └── React Components
```

## 📊 Key Views

### 1. Dashboard Home
- Mode selection (Fabric / Traditional / Comparison)
- Example task templates
- Session history

### 2. Agent Network (3D)
- Interactive force-directed graph
- Animated message flow
- Click agents for details

### 3. Metrics Panel
- Real-time token usage
- Cost tracking
- Performance stats
- Per-agent breakdown

### 4. Comparison View
```
┌──────────────────┬──────────────────┐
│  🧠 NeuroFabric  │  🤖 Traditional  │
│  Network Graph   │  Single Agent    │
│  ⏱️ 32.5s        │  ⏱️ 45.2s        │
│  💰 $0.0016      │  💰 $0.0089      │
└──────────────────┴──────────────────┘
```

## 🛠️ Development Roadmap

### Phase 1: Foundation ✅
- Project setup
- Design system
- State management
- Basic components

### Phase 2: Core Features (Current)
- 3D agent visualization
- Chat interface
- Metrics dashboard
- Backend connection

### Phase 3: Advanced Features
- Multiple view modes
- Export functionality
- Configuration UI
- Session replay

### Phase 4: Polish
- Responsive design
- Performance optimization
- Comprehensive docs
- Demo video

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

This UI is part of the ANHD-NeuroFabric-Cognitive-Framework project. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

CC BY-NC 4.0 - See [LICENSE.md](../../LICENSE.md)

## 🔗 Related

- [Python Multi-Agent Demo](../python-multi-agent) - Backend implementation
- [Main Documentation](../../README.md) - Project overview
- [Whitepaper](../../WHITEPAPER.md) - Theoretical foundation

---

**Status**: 🚧 Active Development | **Updated**: Nov 2024
