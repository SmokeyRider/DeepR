module.exports = async function (context, req) {
  context.log('Adversarial stream endpoint called (compat mode)');

  const { question, roles, turnLimit } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: 'Question is required' }
    };
    return;
  }

  // Generate mock adversarial debate content that matches original streaming format
  const questionSummary = question.length > 60 ? question.substring(0, 60) + "..." : question;
  
  // Simulate the streaming response structure the frontend expects
  const mockCycleData = {
    cycle: 1,
    advocate_output: `## 🛡️ Supporting Position\n\n*I advocate for the affirmative stance on:*\n**"${questionSummary}"**\n\n### Core Arguments:\n\n**1. Practical Benefits**\n- Implementation provides clear, measurable advantages\n- Real-world evidence supports this approach\n- Cost-benefit analysis favors this direction\n\n**2. Strategic Alignment**\n- Aligns with current industry best practices\n- Supports long-term organizational goals\n- Minimizes technical debt and future complications\n\n**Confidence Level: 85%**`,
    
    challenger_output: `## ⚔️ Opposition Analysis\n\n*I present a critical counter-perspective:*\n**"${questionSummary}"**\n\n### Critical Flaws:\n\n**1. Oversimplified Assumptions**\n- Success rates lack proper context\n- Implementation complexity underestimated\n- Hidden costs not accounted for\n\n**2. Context Dependency**\n- Success patterns may not apply to our situation\n- Market conditions differ significantly\n- Timeline pressures create additional risks\n\n**Risk Assessment: Moderate to High**`,
    
    arbiter_output: `## ⚖️ Judicial Analysis & Synthesis\n\n*I evaluate both perspectives on:*\n**"${questionSummary}"**\n\n### Balanced Recommendation:\n1. **Validate Assumptions**: Conduct pilot to verify claims\n2. **Phased Implementation**: Begin with limited scope\n3. **Risk Mitigation**: Use hybrid approach initially\n4. **Continuous Evaluation**: Monitor vs. projected benefits\n\n**Final Judgment**: Qualified Approval with phased approach\n**Overall Confidence: 78%**`,
    
    converged: true
  };

  // Return in format compatible with original Express backend streaming response
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