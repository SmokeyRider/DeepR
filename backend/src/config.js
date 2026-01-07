import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001),
  useMock: process.env.USE_MOCK === 'true',
  
  // Replit AI Integrations - managed OpenAI-compatible access
  replitAI: {
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    defaultModel: 'gpt-5.1',
    chairmanModel: 'gpt-5.1',
  },
  
  // Available models from Replit AI Integrations
  availableModels: [
    { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', description: 'Latest flagship model' },
    { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', description: 'High-performance model' },
    { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', description: 'Balanced performance' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', description: 'Fast and efficient' },
    { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', description: 'Previous generation flagship' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Optimized GPT-4' },
    { id: 'o3', name: 'O3', provider: 'OpenAI', description: 'Reasoning model' },
    { id: 'o3-mini', name: 'O3 Mini', provider: 'OpenAI', description: 'Fast reasoning' },
  ],
  
  // Council member configurations using actual Replit AI models
  councilMembers: [
    { id: 'gpt-5.1', name: 'GPT-5.1', model: 'gpt-5.1', provider: 'OpenAI Flagship', color: '#10B981' },
    { id: 'gpt-4.1', name: 'GPT-4.1', model: 'gpt-4.1', provider: 'OpenAI Advanced', color: '#8B5CF6' },
    { id: 'o3-mini', name: 'O3 Mini', model: 'o3-mini', provider: 'OpenAI Reasoning', color: '#3B82F6' },
  ],
  
  // DxO role configurations
  dxoRoles: [
    { id: 'lead', name: 'Lead Researcher', icon: '🔬', focus: 'Primary analysis and synthesis', color: '#8B5CF6' },
    { id: 'reviewer', name: 'Critical Reviewer', icon: '🔍', focus: 'Identify gaps and weaknesses', color: '#EF4444' },
    { id: 'expert', name: 'Domain Expert', icon: '📚', focus: 'Deep domain knowledge', color: '#3B82F6' },
    { id: 'analyst', name: 'Data Analyst', icon: '📊', focus: 'Quantitative reasoning', color: '#10B981' },
  ],
};
