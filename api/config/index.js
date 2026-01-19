// Azure OpenAI models configuration for Static Web Apps  
// Only deployed models are included
const availableModels = [
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Primary flagship model', color: '#F97316', deployed: true },
  { id: 'o4-mini', name: 'O4 Mini', provider: 'Azure OpenAI', providerKey: 'openai', description: 'Fast reasoning model', color: '#A855F7', deployed: true },
  { id: 'grok-4-fast-reasoning', name: 'Grok-4 Fast Reasoning', provider: 'xAI via Azure', providerKey: 'xai', description: 'xAI reasoning model (may be slow)', color: '#06B6D4', deployed: true, slow: true },
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