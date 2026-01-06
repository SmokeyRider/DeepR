import OpenAI from 'openai';
import { config } from './config.js';

let openaiClient = null;

// Initialize OpenAI client
const getOpenAIClient = () => {
  if (!openaiClient && config.openai.apiKey) {
    openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
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

// Call LLM API
export const callLLM = async (prompt, model = config.openai.defaultModel) => {
  const client = getOpenAIClient();
  
  if (!client) {
    throw new Error('OpenAI client not configured');
  }

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('LLM API Error:', error);
    throw error;
  }
};

// Process council request
export const processCouncilRequest = async (question) => {
  const members = config.councilMembers;
  const memberResponses = [];

  // Get responses from all council members in parallel
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

  // Get chairman synthesis
  const chairmanPrompt = getChairmanPrompt(question, memberResponses);
  const chairmanResponse = await callLLM(chairmanPrompt, config.openai.chairmanModel);
  
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
      name: 'Chairman',
      model: 'Claude Opus 4.5',
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
