// Azure OpenAI models configuration for Static Web Apps  
// Updated to match deployed models: gpt-4.1, o4-mini, grok-4-fast-reasoning
const availableModels = [
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Primary flagship model (deployed)', color: '#F97316', deployed: true },
  { id: 'o4-mini', name: 'O4 Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast reasoning model (deployed)', color: '#A855F7', deployed: true },
  { id: 'grok-4-fast-reasoning', name: 'Grok-4 Fast Reasoning', provider: 'xAI via Azure', providerKey: 'xai', description: 'xAI reasoning model (deployed, may be slow)', color: '#06B6D4', deployed: true, slow: true },
  { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Latest flagship model', color: '#10B981', deployed: false },
  { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'Azure OpenAI', providerKey: 'openai', description: 'High-performance model', color: '#8B5CF6', deployed: false },
  { id: 'gpt-5', name: 'GPT-5', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Balanced performance', color: '#3B82F6', deployed: false },
  { id: 'gpt-4.1-pro', name: 'GPT-4.1 Pro', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Enhanced GPT-4.1', color: '#EF4444', deployed: false },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Optimized GPT-4', color: '#EC4899', deployed: false },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast GPT-4o', color: '#F472B6', deployed: false },
  { id: 'o3', name: 'O3', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Advanced reasoning model', color: '#14B8A6', deployed: false },
  { id: 'o3-mini', name: 'O3 Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast reasoning', color: '#6366F1', deployed: false },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'Azure OpenAI', providerKey: 'openai', description: 'High-performance GPT-4', color: '#F59E0B', deployed: false },
  { id: 'gpt-4', name: 'GPT-4', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Standard GPT-4 model', color: '#84CC16', deployed: false },
];

module.exports = async function (context, req) {
  context.log('Config endpoint called');

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: {
      availableModels,
      defaultModel: 'gpt-4.1',
      chairmanModel: 'gpt-4.1',
      environment: 'Azure Functions'
    }
  };
}