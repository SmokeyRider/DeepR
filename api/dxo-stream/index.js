module.exports = async function (context, req) {
  context.log('DxO stream endpoint called');

  const { question, roles = [] } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: 'Question is required' }
    };
    return;
  }

  // For now, simulate streaming by returning structured data that matches original Express backend
  // The frontend will handle this as if it was streamed
  const mockResponse = {
    question,
    roles: roles.map((role, index) => ({
      id: role.id,
      name: role.name,
      model: role.model,
      icon: role.icon,
      focus: role.focus,
      color: role.color,
      analysis: `## ${role.name} Analysis\n\nThis is a mock analysis from the ${role.name} perspective:\n\n**Focus Area**: ${role.focus}\n\n**Key Insights**:\n- Mock insight 1 for Azure Functions testing\n- Mock insight 2 demonstrating DxO framework\n- Mock insight 3 showing role-based analysis\n\n**Confidence**: ${85 + (index * 3)}%\n\n*Model: ${role.model} (Mock Mode)*`,
      confidence: 85 + (index * 3)
    })),
    summary: `## DxO Framework Summary\n\nThe Decision by Expert Opinion (DxO) framework has analyzed "${question.substring(0, 80)}..." through multiple expert perspectives.\n\n**Key Findings**:\n- All expert roles provided mock analyses\n- Azure Functions deployment is working\n- Frontend integration successful\n\n**Overall Confidence**: 88%\n\n*Framework: DxO Sequential Analysis (Mock Mode)*`
  };

  // Return in Express backend compatible format
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: {
      success: true,
      mode: 'mock',
      question,
      data: mockResponse
    }
  };
}