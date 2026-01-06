# DeepR - AI Decision Frameworks Demo

A demo-ready React SPA showcasing two AI decision-making frameworks:
1. **LLM Council** - Multiple AI models deliberate and a chairman synthesizes
2. **DxO Decision Orchestrator** - Role-based sequential decision-making

![DeepR Screenshot](docs/screenshot.png)

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

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **LLM Integration**: OpenAI API (with mock mode for demos)

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

# Or use real OpenAI API
USE_MOCK=false
OPENAI_API_KEY=your-api-key-here
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
│   │   │   ├── CouncilMemberCard.jsx
│   │   │   ├── ChairmanCard.jsx
│   │   │   ├── RoleCard.jsx
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

## Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `USE_MOCK` | Use mock data instead of real API | true |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `DEFAULT_MODEL` | Default model for members | gpt-4 |
| `CHAIRMAN_MODEL` | Model for chairman synthesis | gpt-4 |

### Switching Between Mock and Live Mode

In `backend/.env`:
```env
# For demos without API costs
USE_MOCK=true

# For real LLM responses
USE_MOCK=false
OPENAI_API_KEY=sk-...
```

## Development

### Adding New Council Members

Edit `backend/src/config.js`:
```javascript
councilMembers: [
  { id: 'new-model', name: 'New Model', model: 'gpt-4', provider: 'Provider Name', color: '#hex' },
  // ...
]
```

### Customizing DxO Roles

Edit the role configuration in `backend/src/config.js` or modify prompts in `backend/src/llmService.js`.

## Demo Tips

1. **Start with Mock Mode** - Ensures reliable demo without API failures
2. **Use Quick Prompts** - Pre-configured questions for best results
3. **Expand Reasoning** - Click to show detailed AI reasoning
4. **Compare Modes** - Switch between Council and DxO to show different approaches

## License

MIT
