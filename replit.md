# DeepR AI Frameworks

## Overview
DeepR is an AI decision-making framework demo that showcases two LLM orchestration patterns:
- **AI LLM Council**: Send prompts to multiple AI models simultaneously, watch them deliberate, and synthesize the best response through a Chairman model.
- **DxO Decision Framework**: Sequential role-based analysis with Lead Researcher, Critical Reviewer, Domain Expert, and Data Analyst roles.

## Project Structure
```
/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main application
│   │   └── main.jsx     # Entry point
│   └── vite.config.js   # Vite configuration
├── backend/           # Express.js backend
│   └── src/
│       ├── index.js     # Express server
│       ├── config.js    # Configuration
│       ├── llmService.js # LLM API integration
│       └── mockData.js  # Mock responses for demo
└── package.json       # Root package with dev scripts
```

## Development
- Frontend runs on port 5000 (0.0.0.0)
- Backend runs on port 3001 (localhost)
- API requests from frontend are proxied to backend via Vite

## Environment Variables
- `USE_MOCK`: Set to "true" for demo mode with mock data (default)
- `OPENAI_API_KEY`: Required for live LLM mode
- `PORT`: Backend port (default: 3001)

## Running the Application
The workflow runs both frontend and backend concurrently:
```
cd backend && node src/index.js & cd frontend && npm run dev
```

## Deployment
- Build: `npm run build --prefix frontend`
- Production: Backend serves the API, frontend is built as static assets
