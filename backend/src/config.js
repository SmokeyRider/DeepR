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
  
  defaultModel: 'gpt-5.1',
  chairmanModel: 'gpt-5.1',
  
  availableModels: [
    { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', providerKey: 'openai', description: 'Latest flagship model', color: '#10B981' },
    { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', providerKey: 'openai', description: 'High-performance model', color: '#8B5CF6' },
    { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', providerKey: 'openai', description: 'Balanced performance', color: '#3B82F6' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Fast and efficient', color: '#F59E0B' },
    { id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'OpenAI', providerKey: 'openai', description: 'Ultra-fast lightweight', color: '#84CC16' },
    { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', providerKey: 'openai', description: 'Previous generation flagship', color: '#EF4444' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Efficient GPT-4.1', color: '#F97316' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', providerKey: 'openai', description: 'Optimized GPT-4', color: '#EC4899' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Fast GPT-4o', color: '#F472B6' },
    { id: 'o4-mini', name: 'O4 Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Compact reasoning', color: '#A855F7' },
    { id: 'o3', name: 'O3', provider: 'OpenAI', providerKey: 'openai', description: 'Advanced reasoning model', color: '#14B8A6' },
    { id: 'o3-mini', name: 'O3 Mini', provider: 'OpenAI', providerKey: 'openai', description: 'Fast reasoning', color: '#6366F1' },
    
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'Anthropic', providerKey: 'anthropic', description: 'Most capable, complex reasoning', color: '#D97706' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', providerKey: 'anthropic', description: 'Balanced performance and speed', color: '#EA580C' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', providerKey: 'anthropic', description: 'Fastest and most compact', color: '#DC2626' },
    { id: 'claude-opus-4-1', name: 'Claude Opus 4.1', provider: 'Anthropic', providerKey: 'anthropic', description: 'Earlier flagship version', color: '#B45309' },
    
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'Google', providerKey: 'gemini', description: 'Most powerful for agentic workflows', color: '#4285F4' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'Google', providerKey: 'gemini', description: 'Hybrid reasoning model', color: '#34A853' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', providerKey: 'gemini', description: 'Excels at coding and reasoning', color: '#FBBC04' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', providerKey: 'gemini', description: 'Fast general purpose', color: '#EA4335' },
    
    { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta (OpenRouter)', providerKey: 'openrouter', description: '400B MoE, multimodal (FREE)', color: '#0668E1' },
    { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta (OpenRouter)', providerKey: 'openrouter', description: 'Latest Llama reasoning (FREE)', color: '#0866FF' },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta (OpenRouter)', providerKey: 'openrouter', description: 'High-performance open model', color: '#1877F2' },
    { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3', provider: 'DeepSeek (OpenRouter)', providerKey: 'openrouter', description: 'Strong reasoning and coding', color: '#00D4AA' },
    { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek (OpenRouter)', providerKey: 'openrouter', description: 'Reasoning specialist', color: '#00B894' },
    { id: 'qwen/qwen3-32b', name: 'Qwen 3 32B', provider: 'Qwen (OpenRouter)', providerKey: 'openrouter', description: 'Multilingual support', color: '#7C3AED' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct', name: 'Mistral Small 3.1', provider: 'Mistral (OpenRouter)', providerKey: 'openrouter', description: 'Efficient with function calling (FREE)', color: '#FF6B35' },
    { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash (OR)', provider: 'Google (OpenRouter)', providerKey: 'openrouter', description: 'Via OpenRouter', color: '#34A853' },
    { id: 'x-ai/grok-3-mini-beta', name: 'Grok 3 Mini', provider: 'xAI (OpenRouter)', providerKey: 'openrouter', description: 'xAI reasoning model', color: '#000000' },
  ],
  
  councilMembers: [
    { id: 'gpt-5.1', name: 'GPT-5.1', model: 'gpt-5.1', provider: 'OpenAI Flagship', color: '#10B981' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', model: 'claude-sonnet-4-5', provider: 'Anthropic', color: '#EA580C' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', model: 'gemini-2.5-flash', provider: 'Google', color: '#34A853' },
  ],
  
  dxoRoles: [
    { id: 'lead', name: 'Lead Researcher', icon: '🔬', focus: 'Primary analysis and synthesis', color: '#8B5CF6' },
    { id: 'reviewer', name: 'Critical Reviewer', icon: '🔍', focus: 'Identify gaps and weaknesses', color: '#EF4444' },
    { id: 'expert', name: 'Domain Expert', icon: '📚', focus: 'Deep domain knowledge', color: '#3B82F6' },
    { id: 'analyst', name: 'Data Analyst', icon: '📊', focus: 'Quantitative reasoning', color: '#10B981' },
  ],
};
