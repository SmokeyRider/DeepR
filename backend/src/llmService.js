import OpenAI from 'openai';
import { config } from './config.js';

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && config.providers.openai.apiKey && config.providers.openai.baseURL) {
    openaiClient = new OpenAI({
      apiKey: config.providers.openai.apiKey,
      baseURL: config.providers.openai.baseURL,
    });
  }
  return openaiClient;
};

const getProviderForModel = (modelId) => {
  // All models are now OpenAI models in Azure migration
  return 'openai';
};

const getCouncilMemberPrompt = (question, memberConfig) => {
  return `You are ${memberConfig.name}, an expert AI council member from ${memberConfig.provider}. 
Your role is to provide a thoughtful, well-reasoned answer to the question below.

Instructions:
1. Provide a brief summary (2-3 sentences) of your recommendation
2. Provide detailed reasoning with bullet points and analysis
3. Assign a confidence score (0-100) based on how certain you are

Question: ${question}

Respond in this JSON format:
{
  "summary": "Your brief recommendation summary",
  "reasoning": "Your detailed reasoning in markdown format with headers and bullet points",
  "confidence": 85
}`;
};

const getChairmanPrompt = (question, memberResponses) => {
  const memberSummaries = memberResponses.map(m => 
    `**${m.name}** (Confidence: ${m.confidence}%): ${m.summary}`
  ).join('\n\n');

  return `You are the Chairman of an AI council. You have received answers from several expert council members.
Your job is to synthesize their responses into a final, well-reasoned decision.

Original Question: ${question}

Council Member Responses:
${memberSummaries}

Instructions:
1. Identify points of consensus among members
2. Note significant disagreements and how you resolve them
3. Provide a clear final recommendation
4. List key agreements and disagreements

Respond in this JSON format:
{
  "finalDecision": "Your comprehensive final decision in markdown format",
  "consensusScore": 85,
  "agreements": ["Point 1", "Point 2"],
  "disagreements": ["Point 1", "Point 2"]
}`;
};

const getDxOPrompts = {
  lead: (question) => `You are the Lead Researcher in a decision-making team.
Your role is to provide an initial analysis and recommendation for the problem.

Problem: ${question}

Provide a comprehensive initial analysis including:
- Problem statement clarification
- Initial recommendation with supporting points
- Key assumptions made

Respond in markdown format with clear headers and bullet points.`,

  reviewer: (question, leadOutput) => `You are the Critical Reviewer in a decision-making team.
Your role is to critically evaluate the Lead Researcher's analysis.

Original Problem: ${question}

Lead Researcher's Analysis:
${leadOutput}

Provide a critical review including:
- Identified gaps or weaknesses in the analysis
- Questions that need answers
- Alternative approaches to consider
- Risk assessment

Respond in markdown format with clear headers and bullet points.`,

  expert: (question, context) => `You are the Domain Expert in a decision-making team.
Your role is to provide specialized domain knowledge and relevant references.

Problem: ${question}

Previous Analysis Context:
${context}

Provide domain expertise including:
- Relevant industry patterns and best practices
- Case studies or examples
- Recommended data sources
- Domain-specific constraints or regulations

Respond in markdown format with clear headers and bullet points.`,

  analyst: (question, context) => `You are the Data Analyst in a decision-making team.
Your role is to provide quantitative analysis and data-driven insights.

Problem: ${question}

Context from team:
${context}

Provide quantitative analysis including:
- Performance projections or metrics
- Cost analysis if applicable
- Statistical confidence in estimates
- Data-driven recommendations

Respond in markdown format. Include tables where appropriate.`,

  final: (question, allContext) => `You are the Final Decision Maker in a decision-making team.
Your role is to synthesize all team inputs into a definitive, actionable recommendation.

You are the senior executive who must make the final call. You have reviewed input from:
- Lead Researcher: Initial analysis and recommendation
- Critical Reviewer: Gaps, weaknesses, and alternative approaches
- Domain Expert: Industry patterns and best practices
- Data Analyst: Quantitative analysis and projections

Original Problem: ${question}

Team Inputs:
${allContext}

Provide a final decision including:
- Executive Summary: 2-3 sentence bottom-line recommendation
- Final Recommendation: Clear, actionable decision with rationale
- Key Revisions: Specific changes made from the initial proposal based on team feedback
- Risk Mitigation: How you addressed the Critical Reviewer's concerns
- Implementation Priority: Ordered next steps
- Confidence Level: Your confidence in this recommendation (Low/Medium/High) with justification

Respond in markdown format with clear headers. Be decisive and actionable.`
};

const stripMarkdownCodeBlocks = (text) => {
  if (!text) return text;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
};

const safeParseJSON = (text) => {
  const cleaned = stripMarkdownCodeBlocks(text);
  return JSON.parse(cleaned);
};

const callOpenAI = async (prompt, model, context = '', maxTokens = 8192) => {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OpenAI client not configured - check AI_INTEGRATIONS_OPENAI_API_KEY');
  }
  console.log(`[OpenAI${context}] Sending request to model: ${model}, prompt length: ${prompt.length} chars, max_tokens: ${maxTokens}`);
  const startTime = Date.now();
  
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: maxTokens,
    });
    
    const elapsed = Date.now() - startTime;
    const content = response.choices?.[0]?.message?.content || '';
    const finishReason = response.choices?.[0]?.finish_reason || 'unknown';
    
    console.log(`[OpenAI${context}] Response received in ${elapsed}ms, finish_reason: ${finishReason}, content length: ${content.length} chars`);
    
    if (!content) {
      console.warn(`[OpenAI${context}] WARNING: Empty content received. Full response:`, JSON.stringify(response, null, 2));
    }
    
    return content;
  } catch (error) {
    console.error(`[OpenAI${context}] API Error:`, error.message, error.status || '', error.code || '');
    throw error;
  }
};

// All models now use OpenAI client in Azure migration

export const callLLM = async (prompt, model = config.defaultModel, options = {}) => {
  const { context = '', maxRetries = 0, maxTokens = 8192 } = options;
  const contextLabel = context ? `:${context}` : '';
  
  console.log(`[Azure OpenAI${contextLabel}] Calling model: ${model}, maxTokens: ${maxTokens}`);

  const attemptCall = async (attempt) => {
    const attemptLabel = maxRetries > 0 ? ` (attempt ${attempt + 1}/${maxRetries + 1})` : '';
    
    try {
      // All models now use OpenAI client (Azure OpenAI Service)
      const content = await callOpenAI(prompt, model, contextLabel + attemptLabel, maxTokens);

      if (!content || content.trim().length === 0) {
        const error = new Error(`Empty response from ${model}`);
        error.isEmptyResponse = true;
        throw error;
      }

      console.log(`[Azure OpenAI${contextLabel}] Success from ${model}: ${content.substring(0, 80)}...`);
      return content;
    } catch (error) {
      console.error(`[Azure OpenAI${contextLabel}] Error from ${model}${attemptLabel}:`, error.message);
      throw error;
    }
  };

  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await attemptCall(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        console.log(`[LLM${contextLabel}] Retrying ${model} after error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
};

const modelColors = config.availableModels.reduce((acc, m) => {
  acc[m.id] = m.color;
  return acc;
}, {});

export const processCouncilRequest = async (question, selectedMemberIds = null, chairmanModelId = null) => {
  const memberIds = selectedMemberIds?.length 
    ? selectedMemberIds 
    : config.councilMembers.map(m => m.id);
  
  const members = memberIds.map(id => {
    const available = config.availableModels.find(m => m.id === id);
    if (available) {
      return {
        id: available.id,
        name: available.name,
        model: available.id,
        provider: available.provider,
        color: available.color || '#6B7280'
      };
    }
    return null;
  }).filter(Boolean);

  if (members.length === 0) {
    throw new Error('No valid council members selected');
  }

  const memberPromises = members.map(async (member) => {
    const prompt = getCouncilMemberPrompt(question, member);
    const response = await callLLM(prompt, member.model);
    
    try {
      const parsed = safeParseJSON(response);
      if (!parsed.summary && !parsed.reasoning) {
        throw new Error('Missing required fields in response');
      }
      return {
        id: member.id,
        name: member.name,
        provider: member.provider,
        color: member.color,
        summary: parsed.summary || 'No summary provided',
        reasoning: parsed.reasoning || parsed.summary || 'No detailed reasoning provided',
        confidence: parsed.confidence || 75,
      };
    } catch (e) {
      console.log(`[Council] JSON parse failed for ${member.name}:`, e.message);
      const cleanedResponse = stripMarkdownCodeBlocks(response) || response || '';
      
      if (!cleanedResponse || cleanedResponse.trim().length < 10) {
        return {
          id: member.id,
          name: member.name,
          provider: member.provider,
          color: member.color,
          summary: `${member.name} did not provide a valid response.`,
          reasoning: `The ${member.name} model was unable to generate a response. Please try again.`,
          confidence: 50
        };
      }
      
      return {
        id: member.id,
        name: member.name,
        provider: member.provider,
        color: member.color,
        summary: cleanedResponse.substring(0, 300),
        reasoning: cleanedResponse,
        confidence: 75
      };
    }
  });

  const memberResponses = await Promise.all(memberPromises);

  const chairmanModel = chairmanModelId || config.chairmanModel;
  const chairmanInfo = config.availableModels.find(m => m.id === chairmanModel);

  const chairmanPrompt = getChairmanPrompt(question, memberResponses);
  const chairmanResponse = await callLLM(chairmanPrompt, chairmanModel);
  
  let chairman;
  try {
    chairman = safeParseJSON(chairmanResponse);
  } catch (e) {
    const cleanedResponse = stripMarkdownCodeBlocks(chairmanResponse) || chairmanResponse;
    chairman = {
      finalDecision: cleanedResponse,
      consensusScore: 80,
      agreements: ['See full synthesis below'],
      disagreements: ['See full synthesis below']
    };
  }

  return {
    members: memberResponses,
    chairman: {
      name: 'Chairperson',
      model: chairmanInfo?.name || chairmanModel,
      ...chairman
    }
  };
};

const callDxORole = async (roleName, prompt, model = config.defaultModel) => {
  console.log(`[DxO:${roleName}] Starting with model: ${model}, prompt length: ${prompt.length} chars`);
  
  try {
    const content = await callLLM(prompt, model, { 
      context: `DxO:${roleName}`, 
      maxRetries: 1,
      maxTokens: 16384
    });
    console.log(`[DxO:${roleName}] Success, content length: ${content.length} chars`);
    return content;
  } catch (error) {
    const diagnostic = `[DxO:${roleName}] FAILED after retry. Model: ${model}. Prompt: ${prompt.length} chars. Error: ${error.message}. ` +
      `Possible causes: (1) Token limit exhausted on reasoning, (2) API rate limiting, (3) model unavailable, (4) prompt too long.`;
    console.error(diagnostic);
    
    const failureError = new Error(`${roleName} failed: ${error.message}`);
    failureError.role = roleName;
    failureError.diagnostic = diagnostic;
    failureError.isRoleFailure = true;
    throw failureError;
  }
};

export const processDxORequest = async (question) => {
  const leadPrompt = getDxOPrompts.lead(question);
  const leadContent = await callDxORole('Lead Researcher', leadPrompt);

  const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
  const reviewerContent = await callDxORole('Critical Reviewer', reviewerPrompt);

  const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
  const expertContent = await callDxORole('Domain Expert', expertPrompt);

  const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
  const analystContent = await callDxORole('Data Analyst', analystPrompt);

  const finalPrompt = getDxOPrompts.final(question, 
    `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}\n\nAnalyst's Data:\n${analystContent}`
  );
  const finalContent = await callDxORole('Final Decision', finalPrompt);

  return {
    leadResearcher: {
      role: 'Lead Researcher',
      icon: '🔬',
      focus: 'Primary analysis and synthesis',
      content: leadContent,
      color: '#8B5CF6'
    },
    criticalReviewer: {
      role: 'Critical Reviewer',
      icon: '🔍',
      focus: 'Identify gaps and weaknesses',
      content: reviewerContent,
      color: '#EF4444'
    },
    domainExpert: {
      role: 'Domain Expert',
      icon: '📚',
      focus: 'Deep domain knowledge',
      content: expertContent,
      color: '#3B82F6'
    },
    dataAnalyst: {
      role: 'Data Analyst',
      icon: '📊',
      focus: 'Quantitative reasoning',
      content: analystContent,
      color: '#10B981'
    },
    finalDecision: {
      role: 'Final Decision',
      icon: '✨',
      title: 'Synthesized Recommendation',
      content: finalContent,
      color: '#F59E0B',
      revisions: []
    }
  };
};

export const processDxORequestStreaming = async (question, onRoleComplete, onError) => {
  console.log('[DxO Stream] Starting sequential role processing...');
  
  try {
    console.log('[DxO Stream] Step 1/5: Lead Researcher');
    const leadPrompt = getDxOPrompts.lead(question);
    const leadContent = await callDxORole('Lead Researcher', leadPrompt);
    onRoleComplete('leadResearcher', {
      role: 'Lead Researcher',
      icon: '🔬',
      focus: 'Primary analysis and synthesis',
      content: leadContent,
      color: '#8B5CF6'
    });

    console.log('[DxO Stream] Step 2/5: Critical Reviewer');
    const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
    const reviewerContent = await callDxORole('Critical Reviewer', reviewerPrompt);
    onRoleComplete('criticalReviewer', {
      role: 'Critical Reviewer',
      icon: '🔍',
      focus: 'Identify gaps and weaknesses',
      content: reviewerContent,
      color: '#EF4444'
    });

    console.log('[DxO Stream] Step 3/5: Domain Expert');
    const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
    const expertContent = await callDxORole('Domain Expert', expertPrompt);
    onRoleComplete('domainExpert', {
      role: 'Domain Expert',
      icon: '📚',
      focus: 'Deep domain knowledge',
      content: expertContent,
      color: '#3B82F6'
    });

    console.log('[DxO Stream] Step 4/5: Data Analyst');
    const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
    const analystContent = await callDxORole('Data Analyst', analystPrompt);
    onRoleComplete('dataAnalyst', {
      role: 'Data Analyst',
      icon: '📊',
      focus: 'Quantitative reasoning',
      content: analystContent,
      color: '#10B981'
    });

    console.log('[DxO Stream] Step 5/5: Final Decision');
    const finalPrompt = getDxOPrompts.final(question, 
      `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}\n\nAnalyst's Data:\n${analystContent}`
    );
    const finalContent = await callDxORole('Final Decision', finalPrompt);
    onRoleComplete('finalDecision', {
      role: 'Final Decision',
      icon: '✨',
      title: 'Synthesized Recommendation',
      content: finalContent,
      color: '#F59E0B',
      revisions: []
    });
    
    console.log('[DxO Stream] All 5 roles completed successfully');
  } catch (error) {
    console.error('[DxO Stream] Pipeline failed:', error.message);
    if (onError) {
      onError({
        role: error.role || 'Unknown',
        message: error.message,
        diagnostic: error.diagnostic || `Role failed: ${error.message}`
      });
    }
    throw error;
  }
};

const getAdversarialPrompts = {
  advocate: (question, previousContext, roleConfig) => {
    const baseInstructions = roleConfig?.instructions || 
      'Provide your strongest, clearest opinion. Take a firm stance. Do not hedge. Present your reasoning in a structured way.';
    
    let prompt = `You are the Advocate. ${baseInstructions}

Question/Topic: ${question}`;

    if (previousContext) {
      prompt += `

Previous debate context:
${previousContext}

Build upon or refine your previous position based on the critique and arbiter's feedback. Strengthen your argument.`;
    }

    prompt += `

Respond in markdown format with clear structure.`;
    return prompt;
  },

  challenger: (question, advocateOutput, roleConfig) => {
    const baseInstructions = roleConfig?.instructions || 
      "Critique the Advocate's argument. Identify logical flaws, missing evidence, weak assumptions, and alternative interpretations. Be adversarial, rigorous, and unsparing.";
    
    return `You are the Challenger. ${baseInstructions}

Question/Topic: ${question}

Advocate's Argument:
${advocateOutput}

Do not offer a final conclusion—only critique. Be thorough in identifying weaknesses.

Respond in markdown format with clear structure.`;
  },

  arbiter: (question, advocateOutput, challengerOutput, isSmartMode, cycleNumber, roleConfig) => {
    const baseInstructions = roleConfig?.instructions || 
      "Evaluate both the Advocate's argument and the Challenger's critique. Identify which points hold up and synthesize the strongest possible final position.";
    
    let prompt = `You are the Arbiter. ${baseInstructions}

Question/Topic: ${question}

Advocate's Argument:
${advocateOutput}

Challenger's Critique:
${challengerOutput}

Your output should be decisive, well-reasoned, and refined.`;

    if (isSmartMode) {
      prompt += `

IMPORTANT: This is cycle ${cycleNumber} of the debate. After completing your evaluation, you MUST explicitly state at the end of your response whether another debate cycle is needed:

If the argument has been sufficiently refined and no additional cycles would meaningfully improve it, end your response with:
"[CONVERGENCE: YES - The debate has reached a well-refined conclusion.]"

If additional debate would meaningfully improve the conclusion, end your response with:
"[CONVERGENCE: NO - Another cycle would help because: (brief reason)]"

You must include one of these exact markers.`;
    }

    prompt += `

Respond in markdown format with clear structure.`;
    return prompt;
  }
};

const processAdversarialRequestStreaming = async (question, roles, turnLimit, onCycleStart, onRoleComplete, onCycleComplete, onError) => {
  const isSmartMode = turnLimit === 'smart';
  const parsedLimit = typeof turnLimit === 'string' ? parseInt(turnLimit, 10) : turnLimit;
  const maxCycles = isSmartMode ? 5 : Math.min(Math.max(parsedLimit || 1, 1), 3);
  const cycles = [];
  let previousContext = '';
  let converged = false;
  let stopReason = null;

  const advocateRole = roles.find(r => r.id === 'advocate') || roles[0];
  const challengerRole = roles.find(r => r.id === 'challenger') || roles[1];
  const arbiterRole = roles.find(r => r.id === 'arbiter') || roles[2];

  const callAdversarialRole = async (roleName, prompt, model) => {
    const provider = getProviderForModel(model);
    console.log(`[Adversarial] ${roleName} using model: ${model} (${provider}), prompt length: ${prompt.length}`);
    
    const startTime = Date.now();
    let content = null;
    
    try {
      switch (provider) {
        case 'openai':
          content = await callOpenAI(prompt, model, ` ${roleName}`, 8192);
          break;
        case 'anthropic':
          content = await callAnthropic(prompt, model, ` ${roleName}`, 8192);
          break;
        case 'gemini':
          content = await callGemini(prompt, model, ` ${roleName}`, 8192);
          break;
        case 'openrouter':
          content = await callOpenRouter(prompt, model, ` ${roleName}`, 8192);
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
      
      const elapsed = Date.now() - startTime;
      console.log(`[Adversarial] ${roleName} completed in ${elapsed}ms, response length: ${content?.length || 0}`);
      
      if (!content || content.trim() === '') {
        throw new Error(`${roleName} returned empty response`);
      }
      
      return content;
    } catch (error) {
      console.error(`[Adversarial] ${roleName} failed:`, error.message);
      const enhancedError = new Error(`${roleName} failed: ${error.message}`);
      enhancedError.role = roleName;
      throw enhancedError;
    }
  };

  try {
    for (let cycle = 1; cycle <= maxCycles && !converged; cycle++) {
      console.log(`[Adversarial] Starting cycle ${cycle}/${maxCycles}`);
      onCycleStart(cycle);

      const advocatePrompt = getAdversarialPrompts.advocate(question, previousContext, advocateRole);
      const advocateOutput = await callAdversarialRole('Advocate', advocatePrompt, advocateRole.model);
      onRoleComplete('advocate', advocateOutput);

      const challengerPrompt = getAdversarialPrompts.challenger(question, advocateOutput, challengerRole);
      const challengerOutput = await callAdversarialRole('Challenger', challengerPrompt, challengerRole.model);
      onRoleComplete('challenger', challengerOutput);

      const arbiterPrompt = getAdversarialPrompts.arbiter(question, advocateOutput, challengerOutput, isSmartMode, cycle, arbiterRole);
      const arbiterOutput = await callAdversarialRole('Arbiter', arbiterPrompt, arbiterRole.model);
      onRoleComplete('arbiter', arbiterOutput);

      if (isSmartMode) {
        const convergenceMatch = arbiterOutput.match(/\[CONVERGENCE:\s*(YES|NO)[^\]]*\]/i);
        if (convergenceMatch) {
          converged = convergenceMatch[1].toUpperCase() === 'YES';
          if (converged) {
            const reasonMatch = arbiterOutput.match(/\[CONVERGENCE:\s*YES\s*-\s*([^\]]+)\]/i);
            stopReason = reasonMatch ? reasonMatch[1].trim() : 'The Arbiter determined the conclusion is well-refined.';
          }
        }
        
        if (cycle >= maxCycles && !converged) {
          converged = true;
          stopReason = `Reached maximum of ${maxCycles} cycles. The Arbiter recommended further refinement but the limit was reached.`;
        }
      }

      const cycleData = {
        advocate_output: advocateOutput,
        challenger_output: challengerOutput,
        arbiter_output: arbiterOutput,
        converged: converged
      };
      cycles.push(cycleData);
      onCycleComplete(cycle, cycleData);

      previousContext = `Previous Advocate Position:\n${advocateOutput}\n\nPrevious Challenger Critique:\n${challengerOutput}\n\nArbiter's Synthesis:\n${arbiterOutput}`;
    }

    const finalOutput = cycles[cycles.length - 1]?.arbiter_output || '';
    const cleanFinalOutput = finalOutput.replace(/\[CONVERGENCE:[^\]]+\]/gi, '').trim();
    
    const summary = `Completed ${cycles.length} debate cycle${cycles.length !== 1 ? 's' : ''}.`;

    return {
      cycles,
      final_output: cleanFinalOutput,
      summary,
      stop_reason: stopReason
    };
  } catch (error) {
    console.error('[Adversarial] Pipeline failed:', error.message);
    if (onError) {
      onError({
        role: error.role || 'Unknown',
        message: error.message
      });
    }
    throw error;
  }
};

export { processAdversarialRequestStreaming };
