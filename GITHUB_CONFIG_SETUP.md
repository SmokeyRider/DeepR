# GitHub Configuration Management Setup

This guide shows you how to manage all configuration variables and secrets in GitHub instead of Azure Portal.

## Step 1: Add Repository Variables (Non-sensitive)

1. Go to your GitHub repository: https://github.com/SmokeyRider/DeepR
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click the **Variables** tab
4. Add these variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `USE_MOCK` | `true` | Enable mock mode for testing |
| `LOG_LEVEL` | `info` | Logging level for Azure Functions |
| `NODE_ENV` | `production` | Node.js environment |

## Step 2: Add Repository Secrets (Sensitive - for Phase 2)

1. In the same location, click the **Secrets** tab  
2. Add these secrets (when you reach Phase 2):

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `OPENAI_API_KEY` | sk-... | Your OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | https://... | Your Azure OpenAI endpoint |

## Step 3: How It Works

- **GitHub Variables/Secrets** → **GitHub Actions Workflow** → **Azure Functions Environment**
- Every deployment automatically syncs your GitHub config to Azure
- No manual Azure Portal configuration needed
- All configuration is version controlled with your code
- Team members can see non-sensitive config values

## Step 4: Immediate Fix

Right now, add just the `USE_MOCK` variable with value `true` to fix your current "API Disconnected" issue.

## Benefits

✅ **Centralized**: All config in one place (GitHub)  
✅ **Version Controlled**: Config changes tracked with code  
✅ **Team Friendly**: Everyone sees the same configuration  
✅ **Secure**: Secrets are encrypted, variables are visible  
✅ **Automated**: No manual Azure Portal updates needed  

## Current Status

Your workflow is now configured to automatically pass these variables to Azure Functions on every deployment.
