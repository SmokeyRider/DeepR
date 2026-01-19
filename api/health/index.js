module.exports = async function (context, req) {
  context.log('Health check endpoint called');

  // For development, hardcode USE_MOCK to true
  // TODO: Make this configurable via environment variables later
  const useMock = process.env.USE_MOCK === 'true' || true; // Always use mock for now
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