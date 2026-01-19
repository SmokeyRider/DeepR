module.exports = async function (context, req) {
  context.log('Adversarial stream endpoint called');

  const { question, supportModel = 'grok-4-fast-reasoning', opposeModel = 'grok-4-fast-reasoning', judgeModel = 'grok-4-fast-reasoning' } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: 'Question is required' }
    };
    return;
  }

  // Generate rich mock adversarial debate content
  const questionSummary = question.length > 60 ? question.substring(0, 60) + "..." : question;
  
  const mockStreamData = [
    { 
      type: 'supporter', 
      content: `## 🛡️ Supporting Position\n\n*As ${supportModel}, I advocate for the affirmative stance on:*\n**"${questionSummary}"**\n\n### Core Arguments:\n\n**1. Practical Benefits**\n- Implementation provides clear, measurable advantages\n- Real-world evidence supports this approach\n- Cost-benefit analysis favors this direction\n\n**2. Strategic Alignment**\n- Aligns with current industry best practices\n- Supports long-term organizational goals\n- Minimizes technical debt and future complications\n\n**3. Risk Mitigation**\n- Lower implementation risk compared to alternatives\n- Established success patterns in similar contexts\n- Clear rollback strategies available\n\n### Supporting Evidence:\n- Industry adoption rates show 73% success rate\n- Reduces operational overhead by approximately 40%\n- Compatible with existing infrastructure and workflows\n\n**Confidence Level: 85%**\n\n*Position: Strong support based on empirical evidence and practical considerations.*` 
    },
    { 
      type: 'opposer', 
      content: `## ⚔️ Opposition Analysis\n\n*As ${opposeModel}, I present a critical counter-perspective:*\n**"${questionSummary}"**\n\n### Critical Flaws in Supporting Argument:\n\n**1. Oversimplified Assumptions**\n- The 73% success rate lacks context about failure conditions\n- Implementation complexity significantly underestimated\n- Hidden costs not properly accounted for\n\n**2. Context Dependency**\n- Success patterns may not apply to our specific situation\n- Market conditions and constraints differ significantly\n- Timeline pressures create additional risk factors\n\n**3. Alternative Solutions Ignored**\n- Multiple viable alternatives not properly evaluated\n- Hybrid approaches could provide better outcomes\n- Existing solutions may be adequate with minor improvements\n\n### Counter-Evidence:\n- Recent studies show 45% of implementations face significant delays\n- True operational overhead reduction often only 15-20%\n- Integration challenges frequently exceed initial estimates\n\n### Recommended Alternative:\n- Phased implementation approach with early validation\n- Pilot testing in controlled environment first\n- Maintain hybrid solution during transition period\n\n**Risk Assessment: Moderate to High**\n\n*Position: Proceed with extreme caution, consider alternatives.*` 
    },
    { 
      type: 'judge', 
      content: `## ⚖️ Judicial Analysis & Synthesis\n\n*As ${judgeModel}, I evaluate both perspectives on:*\n**"${questionSummary}"**\n\n### Argument Quality Assessment:\n\n**Supporting Position Strengths:**\n- Well-structured cost-benefit analysis\n- Concrete metrics and success rates provided\n- Clear strategic alignment demonstrated\n\n**Opposition Position Strengths:**\n- Identifies critical assumptions and blind spots\n- Provides balanced risk assessment\n- Offers constructive alternative approaches\n\n### Synthesis & Recommendation:\n\n**Balanced Approach:**\n1. **Validate Assumptions**: Conduct context-specific pilot to verify claimed success rates\n2. **Phased Implementation**: Begin with limited scope to test integration challenges\n3. **Risk Mitigation**: Implement the opposition's suggested hybrid approach initially\n4. **Continuous Evaluation**: Monitor actual vs. projected benefits during rollout\n\n### Key Decision Factors:\n- **Timeline**: If urgent, proceed with caution and enhanced monitoring\n- **Resources**: Ensure adequate budget for both implementation and rollback\n- **Stakes**: Higher stakes warrant the more conservative phased approach\n\n### Final Judgment:\n**Qualified Approval** - Proceed with implementation using a risk-mitigated phased approach. The supporting arguments have merit, but the opposition's concerns about context dependency and hidden complexities are valid.\n\n**Recommended Action**: Begin with 30-day pilot program incorporating opposition's alternative framework, then evaluate before full implementation.\n\n**Overall Confidence: 78%**\n\n*The adversarial process has successfully identified both opportunities and risks, leading to a more robust decision framework.*` 
    }
  ];

  // For Azure Functions, we'll return the complete response in Express backend compatible format
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
      success: true,
      mode: 'mock',
      question,
      data: {
        question,
        supportModel,
        opposeModel, 
        judgeModel,
        debate: mockStreamData,
        status: 'Adversarial debate analysis complete',
        methodology: 'Three-stage adversarial reasoning: Advocate → Challenger → Arbiter',
        environment: 'Azure Functions (Mock Mode)'
      }
    }
  };
}