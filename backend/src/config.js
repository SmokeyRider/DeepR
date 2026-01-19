import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001),
  useMock: process.env.USE_MOCK === 'true',
  
  providers: {
    openai: {
      // Support both direct OpenAI and Azure OpenAI Service
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || process.env.AZURE_OPENAI_ENDPOINT,
    },
  },
  
  defaultModel: 'gpt-5.1',
  chairmanModel: 'gpt-5.1',
  
  availableModels: [
    { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Latest flagship model', color: '#10B981' },
    { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'Azure OpenAI', providerKey: 'openai', description: 'High-performance model', color: '#8B5CF6' },
    { id: 'gpt-5', name: 'GPT-5', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Balanced performance', color: '#3B82F6' },
    { id: 'gpt-4.1-pro', name: 'GPT-4.1 Pro', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Enhanced GPT-4.1', color: '#EF4444' },
    { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Previous generation flagship', color: '#F97316' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Optimized GPT-4', color: '#EC4899' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast GPT-4o', color: '#F472B6' },
    { id: 'o3', name: 'O3', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Advanced reasoning model', color: '#14B8A6' },
    { id: 'o3-mini', name: 'O3 Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast reasoning', color: '#6366F1' },
    { id: 'o4-mini', name: 'O4 Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Compact reasoning', color: '#A855F7' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'Azure OpenAI', providerKey: 'openai', description: 'High-performance GPT-4', color: '#F59E0B' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Standard GPT-4 model', color: '#84CC16' },
  ],
  
  councilMembers: [
    { id: 'gpt-5.1', name: 'GPT-5.1', model: 'gpt-5.1', provider: 'Azure OpenAI', color: '#10B981' },
    { id: 'gpt-4o', name: 'GPT-4o', model: 'gpt-4o', provider: 'Azure OpenAI', color: '#EC4899' },
    { id: 'o3', name: 'O3', model: 'o3', provider: 'Azure OpenAI', color: '#14B8A6' },
  ],
  
  dxoRoles: [
    { id: 'lead', name: 'Lead Researcher', icon: '🔬', focus: 'Primary analysis and synthesis', color: '#8B5CF6' },
    { id: 'reviewer', name: 'Critical Reviewer', icon: '🔍', focus: 'Identify gaps and weaknesses', color: '#EF4444' },
    { id: 'expert', name: 'Domain Expert', icon: '📚', focus: 'Deep domain knowledge', color: '#3B82F6' },
    { id: 'analyst', name: 'Data Analyst', icon: '📊', focus: 'Quantitative reasoning', color: '#10B981' },
  ],
};
