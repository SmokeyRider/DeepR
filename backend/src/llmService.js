import OpenAI from 'openai';
import { config } from './config.js';

let openaiClient = null;

// Initialize OpenAI client with Replit AI Integrations
const getOpenAIClient = () => {
  if (!openaiClient && config.replitAI.apiKey && config.replitAI.baseURL) {
    openaiClient = new OpenAI({
      apiKey: config.replitAI.apiKey,
      baseURL: config.replitAI.baseURL,
    });
  }
  return openaiClient;
};

// Council member prompts
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

// DxO role prompts
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

  final: (question, allContext) => `You are synthesizing the final decision based on all team inputs.

Original Problem: ${question}

Team Inputs:
${allContext}

Synthesize a final decision that:
- Addresses concerns raised by the Critical Reviewer
- Incorporates domain expertise
- Is supported by the data analysis
- Lists specific changes made from the initial proposal

Respond in markdown format with a clear recommendation and list of revisions made.`
};

// Call LLM API using Replit AI Integrations
export const callLLM = async (prompt, model = config.replitAI.defaultModel) => {
  const client = getOpenAIClient();
  
  if (!client) {
    throw new Error('Replit AI client not configured. Check AI_INTEGRATIONS_OPENAI_API_KEY and AI_INTEGRATIONS_OPENAI_BASE_URL.');
  }

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('LLM API Error:', error);
    throw error;
  }
};

// Model colors for display
const modelColors = {
  'gpt-5.2': '#10B981',
  'gpt-5.1': '#8B5CF6',
  'gpt-5': '#3B82F6',
  'gpt-5-mini': '#F59E0B',
  'gpt-4.1': '#EF4444',
  'gpt-4o': '#EC4899',
  'o3': '#14B8A6',
  'o3-mini': '#6366F1',
};

// Process council request with selected members
export const processCouncilRequest = async (question, selectedMemberIds = null, chairmanModelId = null) => {
  // Build member list from selected IDs, falling back to defaults
  const memberIds = selectedMemberIds?.length 
    ? selectedMemberIds 
    : config.councilMembers.map(m => m.id);
  
  // Map selected IDs to member configs from available models
  const members = memberIds.map(id => {
    const available = config.availableModels.find(m => m.id === id);
    if (available) {
      return {
        id: available.id,
        name: available.name,
        model: available.id,
        provider: available.provider,
        color: modelColors[available.id] || '#6B7280'
      };
    }
    return null;
  }).filter(Boolean);

  if (members.length === 0) {
    throw new Error('No valid council members selected');
  }

  const memberResponses = [];

  // Get responses from all selected council members in parallel
  const memberPromises = members.map(async (member) => {
    const prompt = getCouncilMemberPrompt(question, member);
    const response = await callLLM(prompt, member.model);
    
    try {
      const parsed = JSON.parse(response);
      return {
        id: member.id,
        name: member.name,
        provider: member.provider,
        color: member.color,
        ...parsed
      };
    } catch {
      return {
        id: member.id,
        name: member.name,
        provider: member.provider,
        color: member.color,
        summary: response.substring(0, 200),
        reasoning: response,
        confidence: 75
      };
    }
  });

  const responses = await Promise.all(memberPromises);
  memberResponses.push(...responses);

  // Use specified chairman model or fall back to default
  const chairmanModel = chairmanModelId || config.replitAI.chairmanModel;
  const chairmanInfo = config.availableModels.find(m => m.id === chairmanModel);

  // Get chairman synthesis
  const chairmanPrompt = getChairmanPrompt(question, memberResponses);
  const chairmanResponse = await callLLM(chairmanPrompt, chairmanModel);
  
  let chairman;
  try {
    chairman = JSON.parse(chairmanResponse);
  } catch {
    chairman = {
      finalDecision: chairmanResponse,
      consensusScore: 80,
      agreements: [],
      disagreements: []
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

// Process DxO request
export const processDxORequest = async (question) => {
  // Step 1: Lead Researcher
  const leadPrompt = getDxOPrompts.lead(question);
  const leadContent = await callLLM(leadPrompt);

  // Step 2: Critical Reviewer
  const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
  const reviewerContent = await callLLM(reviewerPrompt);

  // Step 3: Domain Expert
  const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
  const expertContent = await callLLM(expertPrompt);

  // Step 4: Data Analyst
  const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
  const analystContent = await callLLM(analystPrompt);

  // Step 5: Final Decision
  const finalPrompt = getDxOPrompts.final(question, 
    `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}\n\nAnalyst's Data:\n${analystContent}`
  );
  const finalContent = await callLLM(finalPrompt);

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

// Process DxO request with streaming (sends each role as it completes)
export const processDxORequestStreaming = async (question, onRoleComplete) => {
  // Step 1: Lead Researcher
  const leadPrompt = getDxOPrompts.lead(question);
  const leadContent = await callLLM(leadPrompt);
  onRoleComplete('leadResearcher', {
    role: 'Lead Researcher',
    icon: '🔬',
    focus: 'Primary analysis and synthesis',
    content: leadContent,
    color: '#8B5CF6'
  });

  // Step 2: Critical Reviewer
  const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
  const reviewerContent = await callLLM(reviewerPrompt);
  onRoleComplete('criticalReviewer', {
    role: 'Critical Reviewer',
    icon: '🔍',
    focus: 'Identify gaps and weaknesses',
    content: reviewerContent,
    color: '#EF4444'
  });

  // Step 3: Domain Expert
  const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
  const expertContent = await callLLM(expertPrompt);
  onRoleComplete('domainExpert', {
    role: 'Domain Expert',
    icon: '📚',
    focus: 'Deep domain knowledge',
    content: expertContent,
    color: '#3B82F6'
  });

  // Step 4: Data Analyst
  const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
  const analystContent = await callLLM(analystPrompt);
  onRoleComplete('dataAnalyst', {
    role: 'Data Analyst',
    icon: '📊',
    focus: 'Quantitative reasoning',
    content: analystContent,
    color: '#10B981'
  });

  // Step 5: Final Decision
  const finalPrompt = getDxOPrompts.final(question, 
    `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}\n\nAnalyst's Data:\n${analystContent}`
  );
  const finalContent = await callLLM(finalPrompt);
  onRoleComplete('finalDecision', {
    role: 'Final Decision',
    icon: '✨',
    title: 'Synthesized Recommendation',
    content: finalContent,
    color: '#F59E0B',
    revisions: []
  });
};
