import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  useMock: process.env.USE_MOCK === 'true',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: process.env.DEFAULT_MODEL || 'gpt-4',
    chairmanModel: process.env.CHAIRMAN_MODEL || 'gpt-4',
  },
  azure: {
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  },
  // Council member configurations
  councilMembers: [
    { id: 'gpt-5.1', name: 'GPT-5.1', model: 'gpt-4', provider: 'OpenAI Flagship', color: '#10B981' },
    { id: 'claude-opus', name: 'Claude Opus 4.5', model: 'gpt-4', provider: 'Anthropic Flagship', color: '#8B5CF6' },
    { id: 'gemini-pro', name: 'Gemini 3 Pro', model: 'gpt-4', provider: 'Google Flagship', color: '#3B82F6' },
  ],
  // DxO role configurations
  dxoRoles: [
    { id: 'lead', name: 'Lead Researcher', icon: '🔬', focus: 'Primary analysis and synthesis', color: '#8B5CF6' },
    { id: 'reviewer', name: 'Critical Reviewer', icon: '🔍', focus: 'Identify gaps and weaknesses', color: '#EF4444' },
    { id: 'expert', name: 'Domain Expert', icon: '📚', focus: 'Deep domain knowledge', color: '#3B82F6' },
    { id: 'analyst', name: 'Data Analyst', icon: '📊', focus: 'Quantitative reasoning', color: '#10B981' },
  ],
};
