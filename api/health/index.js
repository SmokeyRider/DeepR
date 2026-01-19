module.exports = async function (context, req) {
  context.log('Health check endpoint called');

  const useMock = process.env.USE_MOCK === 'true';
  const hasOpenAIKey = !!(process.env.AZURE_OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY);

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
      mode: useMock ? 'mock' : 'live',
      hasKeys: hasOpenAIKey,
      environment: 'Azure Functions'
    }
  };
}