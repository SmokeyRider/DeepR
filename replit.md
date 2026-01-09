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
- `USE_MOCK`: Set to "true" for demo mode with mock data, "false" for live LLM mode (currently: false)
- `AI_INTEGRATIONS_OPENAI_API_KEY`: Auto-configured by Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Auto-configured by Replit AI Integrations
- `PORT`: Backend port (default: 3001)

## Live LLM Mode
The app is configured to use **Replit AI Integrations** for live LLM access:
- Uses managed OpenAI-compatible API (charges billed to Replit credits)
- Available models: gpt-5.2, gpt-5.1, gpt-5, gpt-5-mini, gpt-4.1, gpt-4o, o3, o3-mini
- Default council members: GPT-5.1 (flagship), GPT-4.1 (advanced), O3 Mini (reasoning)
- Frontend dynamically fetches available models from `/api/config`

## Running the Application
The workflow runs both frontend and backend concurrently:
```
cd backend && node src/index.js & cd frontend && npm run dev
```

## API Endpoints
- `POST /api/council` - LLM Council framework
- `POST /api/dxo` - DxO Decision framework
- `POST /api/council/stream` - Streaming council responses
- `POST /api/dxo/stream` - Streaming DxO responses
- `GET /api/health` - Health check
- `GET /api/config` - Configuration info (available models)

## PWA Support
The app is configured as a Progressive Web App:
- **Installable**: Users can add to home screen on mobile/desktop
- **Offline capable**: Service worker caches assets
- **Auto-updates**: New versions are automatically applied
- Icons in `/frontend/public/`: icon-192x192.svg, icon-512x512.svg, apple-touch-icon.svg
- Configuration in `frontend/vite.config.js` using vite-plugin-pwa

## Deployment
- Build: `npm run build --prefix frontend`
- Production: Backend serves the API, frontend is built as static assets

## Recent Changes (January 2026)
- Added PWA support with vite-plugin-pwa
- Responsive header: "DeepR" title hidden on small screens
- Removed non-functional UI elements (history, settings icons)
- State preservation when switching between Council/DxO modes
- Improved handling of empty LLM responses
- Integrated Replit AI Integrations for managed LLM access
