# DeepR Azure Migration Plan

## Overview
Migrate DeepR from Replit to Azure using Static Web Apps + Functions architecture.
Learning-focused approach with OpenAI-only integration.

## Architecture Decisions
- **Branch**: `azure-migration` (keep Replit version intact)
- **Frontend**: Azure Static Web Apps (PWA)
- **Backend**: Azure Functions (simplest approach)
- **AI**: Azure OpenAI Service only (12 models available)
- **Development**: GitHub Codespaces → Azure (no additional dev environment)

## Phase 0: Setup and Documentation

1. **Create migration documentation** ✅
   - Save complete migration plan as `AZURE_MIGRATION_PLAN.md` in repo root

2. **Create branch and cleanup**
   ```bash
   git checkout -b azure-migration
   git push -u origin azure-migration
   ```
   - Simplify `frontend/src/components/DxORoleSelector.jsx` to show OpenAI models only
   - Simplify `frontend/src/components/CouncilMemberSelector.jsx` to show OpenAI models only

## Phase 1: Frontend to Azure Static Web Apps

1. **Create Azure Static Web App**
   - Set up resource in Azure portal with GitHub integration
   - Resource name: `deepr-swa` or similar

2. **Update PWA config**
   - Modify `frontend/vite.config.js` to remove replit.dev caching patterns
   - Update service worker cache URLs for Azure domains

3. **Deploy and validate**
   - Verify PWA works, static assets load
   - Test automatic deployment from GitHub
   - Validate all frontend components work

4. **Test with mock data**
   - Ensure all components work with mock responses
   - Temporarily disable backend calls

## Phase 2: Backend as Azure Functions

1. **Create Azure Functions API**
   - Add `/api` folder with Functions for:
     - `health` (GET /api/health)
     - `council` (POST /api/council) 
     - `dxo` (POST /api/dxo)
     - `adversarial/stream` (POST /api/adversarial/stream)

2. **Simplify LLM service**
   - Update `backend/src/llmService.js` to use Azure OpenAI Service only
   - Remove Anthropic, Google, OpenRouter providers
   - Keep 12 OpenAI models available via Azure

3. **Configure GitHub secrets**
   - Add `AZURE_OPENAI_API_KEY` 
   - Add `AZURE_OPENAI_ENDPOINT`
   - Configure in GitHub repo settings

4. **Deploy Functions**
   - Static Web Apps automatically deploys `/api` folder
   - Update existing workflow file

5. **Connect and test**
   - Update frontend API calls to use Functions
   - Test all three frameworks (Council, DxO, Adversarial)

## Phase 3: Azure OpenAI Integration

1. **Set up Azure OpenAI**
   - Create Azure OpenAI resource in same resource group
   - Deploy models: GPT-4o, o1-preview, GPT-4-turbo, etc.
   - Note endpoint URL and API key

2. **Update authentication**
   - Modify Functions to use Azure SDK
   - Replace direct OpenAI API calls
   - Use Azure managed identity (optional advanced step)

3. **Configure environment**
   - Use Azure App Settings for production
   - Keep GitHub secrets for CI/CD
   - Set up proper environment separation

4. **Final validation**
   - Test all AI frameworks with real Azure OpenAI
   - Verify streaming works correctly
   - Test PWA installation and caching

## Key Files to Modify

### Frontend Changes
- `frontend/vite.config.js` - Update PWA caching patterns
- `frontend/src/components/DxORoleSelector.jsx` - OpenAI models only
- `frontend/src/components/CouncilMemberSelector.jsx` - OpenAI models only

### Backend Changes  
- `backend/src/llmService.js` - Simplify to Azure OpenAI only
- `backend/src/config.js` - Update for Azure authentication
- Create `/api` folder with Azure Functions

### Configuration
- `.github/workflows/azure-static-web-apps-*.yml` - Update API location
- GitHub Secrets - Add Azure credentials
- Azure App Settings - Production environment variables

## Azure Resources Needed

1. **Resource Group**: `deepr-rg`
2. **Static Web App**: `deepr-swa` 
3. **OpenAI Service**: `deepr-openai`
4. **Optional**: Application Insights for monitoring

## OpenAI Models Available in Azure

### GPT-5 Series
- `gpt-5.2`: Latest GPT-5 model
- `gpt-5.1`: Previous GPT-5 version  
- `gpt-5`: Base GPT-5 model

### GPT-4.1 Series
- `gpt-4.1-pro`: Enhanced GPT-4.1
- `gpt-4.1`: Base GPT-4.1 model

### GPT-4o Series
- `gpt-4o`: Optimized GPT-4
- `gpt-4o-mini`: Lightweight version

### O-Series (Reasoning)
- `o3`: Advanced reasoning model
- `o3-mini`: Compact reasoning model
- `o4-mini`: Latest compact reasoning

### GPT-4 Turbo Series
- `gpt-4-turbo`: High-performance GPT-4
- `gpt-4-turbo-preview`: Preview version

### Legacy
- `gpt-4`: Standard GPT-4 model

## Environment Variables

```env
# GitHub Secrets (for deployment)
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=https://your-instance.openai.azure.com/

# Azure App Settings (for Functions)
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=https://your-instance.openai.azure.com/
USE_MOCK=false
```

## Testing Checklist

### Phase 0
- [x] Migration plan documented
- [ ] Frontend simplified to OpenAI-only
- [ ] Backend simplified to OpenAI-only

### Phase 1
- [ ] Frontend deploys to Azure Static Web Apps
- [ ] PWA installs correctly
- [ ] All routes work (SPA routing)
- [ ] Mock mode works for all frameworks

### Phase 2  
- [ ] Azure Functions deploy successfully
- [ ] Health endpoint returns 200
- [ ] All API endpoints respond correctly
- [ ] CORS configured properly

### Phase 3
- [ ] Azure OpenAI integration works
- [ ] All 12 OpenAI models accessible
- [ ] Streaming responses work
- [ ] Council, DxO, Adversarial frameworks functional

## Rollback Plan
- Switch back to `main` branch
- Revert to Replit deployment if needed
- Keep Azure resources for continued learning

## Next Steps After Completion
- Add Application Insights monitoring
- Implement proper logging
- Consider adding more AI providers back
- Optimize for cost and performance

## Implementation Notes
- Start with Phase 0 setup and documentation
- Test each phase thoroughly before proceeding
- Keep original functionality intact in main branch
- Document any issues encountered for learning purposes