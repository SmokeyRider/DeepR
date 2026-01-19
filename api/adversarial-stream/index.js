module.exports = async function (context, req) {
  context.log('Adversarial stream endpoint called');

  const { question, roles, turnLimit } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: 'Question is required' }
    };
    return;
  }

  // Generate mock adversarial debate content in the format the frontend expects
  const questionSummary = question.length > 60 ? question.substring(0, 60) + "..." : question;
  
  const mockCycleData = {
    cycle: 1,
    advocate_output: `## 🛡️ Supporting Position\n\n*I advocate for the affirmative stance on:*\n**"${questionSummary}"**\n\n### Core Arguments:\n\n**1. Practical Benefits**\n- Implementation provides clear, measurable advantages\n- Real-world evidence supports this approach\n- Cost-benefit analysis favors this direction\n\n**Confidence Level: 85%**`,
    
    challenger_output: `## ⚔️ Opposition Analysis\n\n*I present a critical counter-perspective:*\n**"${questionSummary}"**\n\n### Critical Flaws:\n\n**1. Oversimplified Assumptions**\n- Success rates lack proper context\n- Implementation complexity underestimated\n- Hidden costs not accounted for\n\n**Risk Assessment: Moderate to High**`,
    
    arbiter_output: `## ⚖️ Judicial Analysis & Synthesis\n\n*I evaluate both perspectives on:*\n**"${questionSummary}"**\n\n### Balanced Recommendation:\n1. **Validate Assumptions**: Conduct pilot to verify claims\n2. **Phased Implementation**: Begin with limited scope\n3. **Risk Mitigation**: Use hybrid approach initially\n\n**Final Judgment**: Qualified Approval with phased approach\n**Overall Confidence: 78%**`,
    
    converged: true
  };

  // Return in Express backend compatible format that matches what the frontend expects
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
      data: mockCycleData
    }
  };
}