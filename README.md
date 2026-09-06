# DeepR - AI Decision Frameworks Demo

A demo-ready React SPA showcasing three AI decision-making frameworks:
1. **LLM Council** - Multiple AI models deliberate and a chairman synthesizes
2. **DxO Decision Orchestrator** - Role-based sequential decision-making
3. **Adversarial Debate** - Advocate-Challenger-Arbiter pattern for refined reasoning

## Features

### LLM Council Framework
- Multiple AI council members provide independent answers
- Each member shows confidence scores and detailed reasoning
- Chairman agent synthesizes all inputs into final recommendation
- Visual indicators for consensus and disagreements

### DxO Decision Orchestrator
- Role-based sequential analysis (Lead Researcher → Critic → Expert → Analyst)
- Each role builds upon previous roles' outputs
- Final decision shows revisions and how feedback was incorporated
- Inspired by Microsoft's MAI-DxO research

### Adversarial Debate Framework
- Three-role pattern: Advocate → Challenger → Arbiter
- Multi-turn debate cycles with iterative refinement
- Smart convergence detection or configurable turn limits
- Adversarial critique strengthens final reasoning

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **LLM Integration**: Multi-provider support (OpenAI, Anthropic, Google Gemini, OpenRouter) with mock mode for demos

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd DeepR

# Install dependencies
npm run install:all
```

### Configuration

1. Copy the environment example file:
```bash
cp backend/.env.example backend/.env
```

2. Configure your settings in `backend/.env`:
```env
# Use mock data (no API key needed)
USE_MOCK=true

# Or use real AI APIs
USE_MOCK=false

# OpenAI API Configuration
AI_INTEGRATIONS_OPENAI_API_KEY=your-openai-api-key-here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# Anthropic API Configuration (optional)
AI_INTEGRATIONS_ANTHROPIC_API_KEY=your-anthropic-api-key-here
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://api.anthropic.com

# Google Gemini API Configuration (optional)
AI_INTEGRATIONS_GEMINI_API_KEY=your-gemini-api-key-here
AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com

# OpenRouter API Configuration (optional, for open-source models)
AI_INTEGRATIONS_OPENROUTER_API_KEY=your-openrouter-api-key-here
AI_INTEGRATIONS_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### Running the Application

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Project Structure

```
DeepR/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── CouncilView.jsx
│   │   │   ├── DxOView.jsx
│   │   │   ├── AdversarialView.jsx
│   │   │   ├── CouncilMemberCard.jsx
│   │   │   ├── ChairmanCard.jsx
│   │   │   ├── RoleCard.jsx
│   │   │   ├── FinalDecisionCard.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
│
├── backend/               # Node.js backend
│   └── src/
│       ├── index.js       # Express server
│       ├── config.js      # Configuration
│       ├── llmService.js  # LLM API integration
│       └── mockData.js    # Mock responses
│
└── package.json           # Root package.json
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Council Framework
```
POST /api/council
Body: { "question": "Your research question" }

POST /api/council/stream  # Streaming responses
Body: { "question": "Your research question" }
```

### DxO Framework
```
POST /api/dxo
Body: { "question": "Your decision problem" }

POST /api/dxo/stream  # Streaming responses
Body: { "question": "Your decision problem" }
```

### Adversarial Debate Framework
```
POST /api/adversarial/stream  # Streaming responses
Body: { 
  "question": "Your research question",
  "roles": [
    { "id": "advocate", "model": "gpt-5.3", ... },
    { "id": "challenger", "model": "gpt-5.3", ... },
    { "id": "arbiter", "model": "gpt-5.3", ... }
  ],
  "turnLimit": "smart" // or "1", "2", "3"
}
```

## Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `USE_MOCK` | Use mock data instead of real API | true |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | - |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI API base URL | - |
| `AI_INTEGRATIONS_ANTHROPIC_API_KEY` | Anthropic API key | - |
| `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` | Anthropic API base URL | - |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Google Gemini API key | - |
| `AI_INTEGRATIONS_GEMINI_BASE_URL` | Gemini API base URL | - |
| `AI_INTEGRATIONS_OPENROUTER_API_KEY` | OpenRouter API key (for open-source models) | - |
| `AI_INTEGRATIONS_OPENROUTER_BASE_URL` | OpenRouter API base URL | - |

### Switching Between Mock and Live Mode

In `backend/.env`:
```env
# For demos without API costs
USE_MOCK=true

# For real LLM responses (requires API keys)
USE_MOCK=false
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_ANTHROPIC_API_KEY=sk-ant-...
AI_INTEGRATIONS_GEMINI_API_KEY=...
AI_INTEGRATIONS_OPENROUTER_API_KEY=sk-or-...
```

## Development

### Adding New Council Members

Edit `backend/src/config.js`:
```javascript
councilMembers: [
  { id: 'new-model', name: 'New Model', model: 'gpt-5.3', provider: 'Provider Name', color: '#hex' },
  // ...
]
```

Note: The application supports multiple AI providers including OpenAI, Anthropic, Google Gemini, and OpenRouter (for open-source models like Llama, DeepSeek, etc.).

### Customizing DxO Roles

Edit the role configuration in `backend/src/config.js` or modify prompts in `backend/src/llmService.js`.

## Demo Tips

1. **Start with Mock Mode** - Ensures reliable demo without API failures
2. **Use Quick Prompts** - Pre-configured questions for best results
3. **Expand Reasoning** - Click to show detailed AI reasoning
4. **Compare Modes** - Switch between Council, DxO, and Adversarial to show different approaches
5. **Select Models** - Choose from multiple AI providers (OpenAI, Anthropic, Google, OpenRouter)
6. **Adversarial Turns** - Configure debate cycles for deeper analysis

## Deployment

The frontend deploys to Azure Static Web Apps via GitHub Actions on push to
`main`. If the live site stops updating, the most common cause is a missing
deployment-token secret. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the
full setup and troubleshooting steps.

## License

MIT
