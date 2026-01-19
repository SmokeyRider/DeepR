module.exports = async function (context, req) {
  context.log('Health check endpoint called');
  
  // Log environment variables for debugging
  context.log('Environment variables:');
  context.log('USE_MOCK:', process.env.USE_MOCK);
  context.log('AZURE_OPENAI_API_KEY exists:', !!process.env.AZURE_OPENAI_API_KEY);
  context.log('AZURE_OPENAI_ENDPOINT exists:', !!process.env.AZURE_OPENAI_ENDPOINT);
  context.log('AI_INTEGRATIONS_OPENAI_API_KEY exists:', !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY);

  const useMock = process.env.USE_MOCK === 'true';
  const hasOpenAIKey = !!(process.env.AZURE_OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY);
  const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;
  const hasAllCredentials = hasOpenAIKey && hasEndpoint;
  const actualMode = (useMock || !hasAllCredentials) ? 'mock' : 'live';

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: actualMode,
      hasKeys: hasOpenAIKey,
      hasEndpoint: hasEndpoint,
      hasAllCredentials: hasAllCredentials,
      useMockSetting: useMock,
      environment: 'Azure Functions',
      debug: {
        azureOpenAIKey: !!process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        aiIntegrationsKey: !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY
      }
    }
  };
}