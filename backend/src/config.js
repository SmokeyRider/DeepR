import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001),
  useMock: process.env.USE_MOCK === 'true',
  
  providers: {
    openai: {
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    },
    anthropic: {
      apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    },
    gemini: {
      apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
    },
    openrouter: {
      apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
    },
  },
  
  defaultModel: 'gpt-5.3',
  chairmanModel: 'gpt-5.3',

  availableModels: [
    { id: 'gpt-5.3', name: 'GPT-5.3', provider: 'OpenAI', providerKey: 'openai', description: 'Flagship reasoning model', color: '#10B981' },
    { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', providerKey: 'openai', description: 'High-performance model', color: '#8B5CF6' },
    { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', providerKey: 'openai', description: 'Balanced performance', color: '#3B82F6' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Fast and efficient', color: '#F59E0B' },
    { id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'OpenAI', providerKey: 'openai', description: 'Ultra-fast lightweight', color: '#84CC16' },

    { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', providerKey: 'anthropic', description: 'Most capable, complex reasoning', color: '#D97706' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', providerKey: 'anthropic', description: 'Balanced performance and speed', color: '#EA580C' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', providerKey: 'anthropic', description: 'Fastest and most compact', color: '#DC2626' },

    { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: 'Google', providerKey: 'gemini', description: 'Most powerful for agentic workflows', color: '#4285F4' },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', providerKey: 'gemini', description: 'Fast hybrid reasoning model', color: '#34A853' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', providerKey: 'gemini', description: 'Excels at coding and reasoning', color: '#FBBC04' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', providerKey: 'gemini', description: 'Fast general purpose', color: '#EA4335' },

    { id: 'deepseek/deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek (OpenRouter)', providerKey: 'openrouter', description: 'Fast MoE, 1M context, great value', color: '#00D4AA' },
    { id: 'deepseek/deepseek-v4', name: 'DeepSeek V4', provider: 'DeepSeek (OpenRouter)', providerKey: 'openrouter', description: 'Near-frontier reasoning and coding', color: '#00B894' },
    { id: 'z-ai/glm-5.2', name: 'GLM 5.2', provider: 'Z.ai (OpenRouter)', providerKey: 'openrouter', description: 'Strong open agentic and coding model', color: '#7C3AED' },
    { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta (OpenRouter)', providerKey: 'openrouter', description: '400B MoE, multimodal', color: '#0668E1' },
    { id: 'qwen/qwen3-32b', name: 'Qwen 3 32B', provider: 'Qwen (OpenRouter)', providerKey: 'openrouter', description: 'Multilingual open model', color: '#FF6B35' },
  ],

  councilMembers: [
    { id: 'gpt-5.3', name: 'GPT-5.3', model: 'gpt-5.3', provider: 'OpenAI Flagship', color: '#10B981' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', model: 'claude-sonnet-4-5', provider: 'Anthropic', color: '#EA580C' },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash', model: 'gemini-3-flash', provider: 'Google', color: '#34A853' },
  ],
  
  dxoRoles: [
    { id: 'lead', name: 'Lead Researcher', icon: '🔬', focus: 'Primary analysis and synthesis', color: '#8B5CF6' },
    { id: 'reviewer', name: 'Critical Reviewer', icon: '🔍', focus: 'Identify gaps and weaknesses', color: '#EF4444' },
    { id: 'expert', name: 'Domain Expert', icon: '📚', focus: 'Deep domain knowledge', color: '#3B82F6' },
    { id: 'analyst', name: 'Data Analyst', icon: '📊', focus: 'Quantitative reasoning', color: '#10B981' },
  ],
};
