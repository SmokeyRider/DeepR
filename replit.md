# DeepR AI Frameworks

## Overview
DeepR is an AI decision-making framework demo that showcases three LLM orchestration patterns:
- **AI LLM Council**: Send prompts to multiple AI models simultaneously, watch them deliberate, and synthesize the best response through a Chairman model.
- **DxO Decision Framework**: Sequential role-based analysis with Lead Researcher, Critical Reviewer, Domain Expert, and Data Analyst roles.
- **Adversarial Debate**: A single model argues (Advocate), critiques itself (Challenger), and judges the debate (Arbiter) to produce a refined, high-confidence conclusion.

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
│       ├── config.js    # Configuration with multi-provider support
│       ├── llmService.js # Multi-provider LLM API integration
│       └── mockData.js  # Mock responses for demo
└── package.json       # Root package with dev scripts
```

## Development
- Frontend runs on port 5000 (0.0.0.0)
- Backend runs on port 3001 (localhost)
- API requests from frontend are proxied to backend via Vite

## Environment Variables (Auto-configured by Replit AI Integrations)
- `USE_MOCK`: Set to "true" for demo mode with mock data, "false" for live LLM mode (currently: false)
- OpenAI: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Anthropic: `AI_INTEGRATIONS_ANTHROPIC_API_KEY`, `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`
- Google Gemini: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`
- OpenRouter: `AI_INTEGRATIONS_OPENROUTER_API_KEY`, `AI_INTEGRATIONS_OPENROUTER_BASE_URL`
- `PORT`: Backend port (default: 3001)

## Multi-Provider LLM Support
The app supports 4 LLM providers via **Replit AI Integrations** (no API keys required, charges billed to Replit credits):

### OpenAI Models (12 models)
- gpt-5.2, gpt-5.1, gpt-5, gpt-5-mini, gpt-5-nano
- gpt-4.1, gpt-4.1-mini, gpt-4o, gpt-4o-mini
- o4-mini, o3, o3-mini

### Anthropic Claude Models (4 models)
- claude-opus-4-5 (most capable)
- claude-sonnet-4-5 (balanced)
- claude-haiku-4-5 (fastest)
- claude-opus-4-1

### Google Gemini Models (4 models)
- gemini-3-pro-preview, gemini-3-flash-preview
- gemini-2.5-pro, gemini-2.5-flash

### OpenRouter Models (9+ models, access to 300+)
- meta-llama/llama-4-maverick (FREE), meta-llama/llama-4-scout (FREE)
- meta-llama/llama-3.3-70b-instruct
- deepseek/deepseek-chat-v3-0324, deepseek/deepseek-r1
- qwen/qwen3-32b
- mistralai/mistral-small-3.1-24b-instruct (FREE)
- google/gemini-2.5-flash-preview
- x-ai/grok-3-mini-beta

## Running the Application
The workflow runs both frontend and backend concurrently:
```
cd backend && node src/index.js & cd frontend && npm run dev
```

## API Endpoints
- `POST /api/council` - LLM Council framework
- `POST /api/dxo` - DxO Decision framework
- `POST /api/adversarial/stream` - Adversarial Debate framework (streaming only)
- `POST /api/council/stream` - Streaming council responses
- `POST /api/dxo/stream` - Streaming DxO responses
- `GET /api/health` - Health check
- `GET /api/config` - Configuration info (available models from all providers)

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

## Adversarial Debate Mode
The Adversarial mode uses three roles in a cyclical debate pattern:
1. **Advocate**: Takes a strong position and argues for it
2. **Challenger**: Attacks the argument, finding flaws and weaknesses  
3. **Arbiter**: Evaluates both sides and synthesizes the best conclusion

### Turn Limit Options
- **Smart** (default): AI determines when conclusion is refined enough (max 5 cycles)
- **1-3 Turns**: Fixed number of debate cycles

In Smart mode, the Arbiter decides whether another cycle would improve the conclusion, automatically stopping when the argument has been sufficiently refined.

## Save & Share
All three modes support exporting completed prompts:
- **Save**: Download results as JSON file (includes prompt, mode, configuration, and all outputs)
- **Copy**: Copy as formatted Markdown for sharing in Slack, Discord, docs, or email

Export formats:
- **JSON Download**: Full structured data for importing/backup
- **Markdown Copy**: Human-readable format with headers, bullet points, and formatting

Example Markdown output:
```markdown
# DeepR Council Analysis

**Prompt:** What are the pros and cons of...

## Council Member Responses
### GPT-5.1
[Their response...]

## Chairman's Synthesis
**Consensus Score:** 85%
[Final synthesis...]

---
*Exported from DeepR on January 12, 2026*
```

## Recent Changes (January 2026)
- **Save/Share functionality**: Export completed prompts as JSON with Download and Copy buttons
- **Adversarial Debate mode**: New debate framework with Advocate, Challenger, and Arbiter roles
- **Fixed duplicate arbiter**: Final arbiter response now only shown in Final Verdict block (not duplicated in cycle card)
- **Multi-provider LLM support**: Added Anthropic, Google Gemini, and OpenRouter alongside OpenAI
- **29 models available**: 12 OpenAI + 4 Anthropic + 4 Gemini + 9 OpenRouter
- **Provider-grouped UI**: Frontend model selector displays models grouped by provider
- **Default council members**: GPT-5.1 (OpenAI), Claude Sonnet 4.5 (Anthropic), Gemini 2.5 Flash (Google)
- Added PWA support with vite-plugin-pwa
- Responsive header: "DeepR" title hidden on small screens
- State preservation when switching between Council/DxO/Adversarial modes
- Improved handling of empty LLM responses
