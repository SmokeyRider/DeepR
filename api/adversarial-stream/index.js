module.exports = async function (context, req) {
  context.log('Adversarial stream endpoint called');

  const { question, supportModel = 'gpt-4o', opposeModel = 'o3', judgeModel = 'gpt-5.1' } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: 'Question is required' }
    };
    return;
  }

  // Mock streaming response for Azure Functions
  const mockStreamData = [
    { type: 'supporter', content: `## Supporting Argument\n\nAs ${supportModel}, I support the position on "${question.substring(0, 50)}..."\n\n**Key Arguments:**\n- Mock supporting point 1\n- Azure Functions deployment successful\n- Static Web Apps integration working\n\n*This is a simulated response for testing.*` },
    { type: 'opposer', content: `## Opposing Argument\n\nAs ${opposeModel}, I present counterarguments:\n\n**Counter-Arguments:**\n- Mock opposing point 1\n- Alternative perspective for testing\n- Different viewpoint demonstration\n\n*This is a simulated opposition response.*` },
    { type: 'judge', content: `## Final Judgment\n\nAs ${judgeModel} acting as judge:\n\n**Analysis:**\n- Both perspectives presented valid mock arguments\n- Azure deployment is functioning correctly\n- Adversarial framework ready for real AI integration\n\n**Decision:** The adversarial debate framework is successfully deployed and ready for Azure OpenAI integration.\n\n**Confidence:** 90%` }
  ];

  // For Azure Functions, we'll return the complete response rather than streaming
  // Real streaming would require Server-Sent Events setup
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: {
      question,
      supportModel,
      opposeModel, 
      judgeModel,
      debate: mockStreamData,
      status: 'Mock adversarial debate complete',
      environment: 'Azure Functions'
    }
  };
}