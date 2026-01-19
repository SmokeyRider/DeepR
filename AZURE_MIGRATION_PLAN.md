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

## ✅ Phase 0: Setup and Documentation - COMPLETED

1. **Create migration documentation** ✅
   - Saved complete migration plan as `AZURE_MIGRATION_PLAN.md` in repo root

2. **Create branch and cleanup** ✅
   ```bash
   git checkout -b azure-migration
   git push -u origin azure-migration
   ```
   - ✅ Simplified `frontend/src/components/DxORoleSelector.jsx` to show OpenAI models only
   - ✅ Simplified `frontend/src/components/CouncilMemberSelector.jsx` to show OpenAI models only
   - ✅ Updated `backend/src/config.js` to OpenAI-only configuration
   - ✅ Simplified `backend/src/llmService.js` for OpenAI integration

## ✅ Phase 1: Frontend to Azure Static Web Apps - COMPLETED

1. **Create Azure Static Web App** ✅
   - ✅ Resource created: `deepResearch` (Standard tier)
   - ✅ GitHub Actions workflow auto-generated and configured
   - ✅ Domain: `ambitious-ground-04dc9da1e.2.azurestaticapps.net`

2. **Update PWA config** ✅
   - ✅ Modified `frontend/vite.config.js` to remove replit.dev caching patterns
   - ✅ Updated service worker cache URLs for Azure domains
   - ✅ Fixed Node.js version compatibility (20.x) with engines field
   - ✅ Moved build dependencies from devDependencies to dependencies for Azure compatibility

3. **Deploy and validate** ✅
   - ✅ PWA works, static assets load correctly
   - ✅ Automatic deployment from GitHub Actions working
   - ✅ All frontend components functional

4. **Test with mock data** ✅
   - ✅ All components work with mock responses
   - ✅ Backend calls integrated and working

## ✅ Phase 1b: Backend as Azure Functions - COMPLETED

1. **Create Azure Functions API** ✅
   - ✅ Added `/api` folder with Functions for:
     - ✅ `health` (GET /api/health) - Returns system status and mode
     - ✅ `config` (GET /api/config) - Returns available models and configuration
     - ✅ `council` (POST /api/council) - Council of experts mock responses
     - ✅ `dxo` (POST /api/dxo) - Decision by expert opinion mock responses
     - ✅ `adversarial-stream` (POST /api/adversarial-stream) - Adversarial debate mock responses

2. **Environment Variables & Configuration** ✅
   - ✅ GitHub-based configuration management setup
   - ✅ Mock mode enabled by default (`USE_MOCK=true`)
   - ✅ Environment variables properly configured for Azure Functions
   - ✅ Created `GITHUB_CONFIG_SETUP.md` documentation

3. **CI/CD Pipeline** ✅
   - ✅ GitHub Actions workflow configured for automatic deployment
   - ✅ Frontend and backend deploy together from single workflow
   - ✅ Node.js 20.x compatibility resolved
   - ✅ Build process optimized for Azure Static Web Apps

4. **Frontend Integration** ✅
   - ✅ Frontend successfully calls backend APIs
   - ✅ Health API working with cache-busting and auto-refresh
   - ✅ API status indicator shows amber "Mock Mode" correctly
   - ✅ CORS headers configured properly
   - ✅ All three AI frameworks (Council, DxO, Adversarial) working with rich mock content

## ✅ Phase 1c: Enhanced Mock Content - COMPLETED

1. **Rich Mock Responses** ✅
   - ✅ Council mode: Multiple expert perspectives with detailed analyses
   - ✅ DxO mode: Sequential expert analysis with structured recommendations  
   - ✅ Adversarial mode: Support → Opposition → Judge debate flow with realistic arguments

2. **Sample Prompts & UX** ✅
   - ✅ Mode-specific quick prompts for each framework
   - ✅ Council: Technical architecture and best practices
   - ✅ DxO: Decision-focused "should we" questions
   - ✅ Adversarial: Controversial debate topics
   - ✅ Enhanced UI with sample prompt buttons

## 🎯 CURRENT STATUS: Phase 1 COMPLETE! ✅

**✅ Successfully Deployed:**
- **Frontend**: https://ambitious-ground-04dc9da1e.2.azurestaticapps.net
- **Backend**: Azure Functions with mock mode enabled
- **CI/CD**: Automatic GitHub Actions deployment pipeline
- **Configuration**: GitHub-based secrets and environment variable management

**✅ Verified Working:**
- PWA functionality with service worker
- All three AI decision frameworks with rich mock content
- API health monitoring with real-time status
- Responsive design and user interface
- Sample prompts and quick-start experience

## 📋 Phase 2: Azure OpenAI Integration - NEXT

**Goal**: Replace mock responses with real Azure OpenAI Service integration

### 2.1 Azure OpenAI Service Setup
1. **Create Azure OpenAI Resource**
   - Request access to Azure OpenAI Service (if not already approved)
   - Create resource in same region as Static Web App
   - Deploy models: `gpt-4o`, `gpt-4o-mini`, `o1-preview`, `o1-mini`

2. **Configure Authentication**
   - Get API endpoint and access key
   - Add to GitHub Secrets: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`
   - Update Functions to use real API calls when `USE_MOCK=false`

### 2.2 Update Backend Functions
1. **Enhance llmService Integration**
   - Update `/api/config` to return real Azure OpenAI models
   - Modify `/api/council` to call Azure OpenAI for each council member
   - Update `/api/dxo` for sequential expert analysis
   - Implement `/api/adversarial-stream` with real streaming responses

2. **Configuration Management**
   - Set `USE_MOCK=false` in GitHub repository variables
   - Add model configuration for Azure OpenAI deployments
   - Implement proper error handling and fallback to mock mode

### 2.3 Testing & Validation
1. **Gradual Rollout**
   - Test with single endpoint first (health → config → council)
   - Validate response quality and performance
   - Monitor usage and costs in Azure portal

2. **User Experience**
   - Update status indicator to show "Live" mode
   - Add model selection and configuration UI
   - Implement proper loading states for real API calls

## 🚀 Phase 3: Production Optimization - FUTURE

### 3.1 Performance & Scaling
- Implement response caching strategies
- Add rate limiting and usage monitoring
- Optimize Azure Functions cold start performance

### 3.2 Advanced Features
- Add conversation history and context
- Implement user sessions and preferences
- Add export/sharing capabilities for analyses

### 3.3 Monitoring & Analytics
- Set up Application Insights monitoring
- Add usage analytics and performance metrics
- Implement cost monitoring and alerts

## 📊 Migration Progress Summary

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| **Phase 0** | ✅ **Complete** | Branch setup, code simplification, documentation |
| **Phase 1a** | ✅ **Complete** | Azure Static Web Apps deployment, PWA functionality |
| **Phase 1b** | ✅ **Complete** | Azure Functions backend, CI/CD pipeline |
| **Phase 1c** | ✅ **Complete** | Rich mock content, sample prompts, UX polish |
| **Phase 2** | 🎯 **Next** | Azure OpenAI Service integration |
| **Phase 3** | 📋 **Future** | Production optimization, advanced features |

## 🎉 Phase 1 Achievement Summary

**What We Built:**
- ✅ **Full-stack Azure deployment** with Static Web Apps + Functions
- ✅ **Automated CI/CD pipeline** with GitHub Actions
- ✅ **Three AI frameworks** working with comprehensive mock data
- ✅ **Progressive Web App** with service worker and offline capability
- ✅ **GitHub-managed configuration** with secrets and environment variables
- ✅ **Production-ready architecture** ready for real AI integration

**Learning Outcomes:**
- ✅ **Azure Static Web Apps** deployment patterns and configuration
- ✅ **Azure Functions** serverless backend development
- ✅ **GitHub Actions** CI/CD workflow design
- ✅ **Node.js compatibility** issues and resolution in cloud environments
- ✅ **Mock-first development** for rapid prototyping and testing

**Ready for Phase 2**: The foundation is solid, and adding real Azure OpenAI integration will be straightforward! 🚀
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