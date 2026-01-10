import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import { config } from './config.js';

let openaiClient = null;
let anthropicClient = null;
let geminiClient = null;
let openrouterClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && config.providers.openai.apiKey && config.providers.openai.baseURL) {
    openaiClient = new OpenAI({
      apiKey: config.providers.openai.apiKey,
      baseURL: config.providers.openai.baseURL,
    });
  }
  return openaiClient;
};

const getAnthropicClient = () => {
  if (!anthropicClient && config.providers.anthropic.apiKey && config.providers.anthropic.baseURL) {
    anthropicClient = new Anthropic({
      apiKey: config.providers.anthropic.apiKey,
      baseURL: config.providers.anthropic.baseURL,
    });
  }
  return anthropicClient;
};

const getGeminiClient = () => {
  if (!geminiClient && config.providers.gemini.apiKey && config.providers.gemini.baseURL) {
    geminiClient = new GoogleGenAI({
      apiKey: config.providers.gemini.apiKey,
      httpOptions: {
        apiVersion: '',
        baseUrl: config.providers.gemini.baseURL,
      },
    });
  }
  return geminiClient;
};

const getOpenRouterClient = () => {
  if (!openrouterClient && config.providers.openrouter.apiKey && config.providers.openrouter.baseURL) {
    openrouterClient = new OpenAI({
      apiKey: config.providers.openrouter.apiKey,
      baseURL: config.providers.openrouter.baseURL,
    });
  }
  return openrouterClient;
};

const getProviderForModel = (modelId) => {
  const model = config.availableModels.find(m => m.id === modelId);
  return model?.providerKey || 'openai';
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

const callOpenAI = async (prompt, model) => {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OpenAI client not configured');
  }
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: 2048,
  });
  return response.choices?.[0]?.message?.content || '';
};

const callAnthropic = async (prompt, model) => {
  const client = getAnthropicClient();
  if (!client) {
    throw new Error('Anthropic client not configured');
  }
  const message = await client.messages.create({
    model,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  const content = message.content[0];
  return content.type === 'text' ? content.text : '';
};

const callGemini = async (prompt, model) => {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('Gemini client not configured');
  }
  const response = await client.models.generateContent({
    model,
    contents: prompt,
  });
  return response.text || '';
};

const callOpenRouter = async (prompt, model) => {
  const client = getOpenRouterClient();
  if (!client) {
    throw new Error('OpenRouter client not configured');
  }
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
  });
  return response.choices?.[0]?.message?.content || '';
};

export const callLLM = async (prompt, model = config.defaultModel) => {
  const provider = getProviderForModel(model);
  console.log(`[LLM] Calling model: ${model} (provider: ${provider})`);

  try {
    let content;
    switch (provider) {
      case 'anthropic':
        content = await callAnthropic(prompt, model);
        break;
      case 'gemini':
        content = await callGemini(prompt, model);
        break;
      case 'openrouter':
        content = await callOpenRouter(prompt, model);
        break;
      case 'openai':
      default:
        content = await callOpenAI(prompt, model);
        break;
    }

    console.log(`[LLM] Response from ${model}: ${content ? content.substring(0, 100) + '...' : 'EMPTY/NULL'}`);
    return content || '';
  } catch (error) {
    console.error(`[LLM] API Error for ${model}:`, error.message);
    throw error;
  }
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

export const processDxORequest = async (question) => {
  const leadPrompt = getDxOPrompts.lead(question);
  const leadContent = await callLLM(leadPrompt);

  const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
  const reviewerContent = await callLLM(reviewerPrompt);

  const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
  const expertContent = await callLLM(expertPrompt);

  const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
  const analystContent = await callLLM(analystPrompt);

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

export const processDxORequestStreaming = async (question, onRoleComplete) => {
  console.log('[DxO] Step 1: Lead Researcher starting...');
  const leadPrompt = getDxOPrompts.lead(question);
  const leadContent = await callLLM(leadPrompt);
  console.log('[DxO] Step 1: Lead Researcher complete');
  onRoleComplete('leadResearcher', {
    role: 'Lead Researcher',
    icon: '🔬',
    focus: 'Primary analysis and synthesis',
    content: leadContent,
    color: '#8B5CF6'
  });

  console.log('[DxO] Step 2: Critical Reviewer starting...');
  const reviewerPrompt = getDxOPrompts.reviewer(question, leadContent);
  const reviewerContent = await callLLM(reviewerPrompt);
  console.log('[DxO] Step 2: Critical Reviewer complete');
  onRoleComplete('criticalReviewer', {
    role: 'Critical Reviewer',
    icon: '🔍',
    focus: 'Identify gaps and weaknesses',
    content: reviewerContent,
    color: '#EF4444'
  });

  console.log('[DxO] Step 3: Domain Expert starting...');
  const expertPrompt = getDxOPrompts.expert(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}`);
  const expertContent = await callLLM(expertPrompt);
  console.log('[DxO] Step 3: Domain Expert complete');
  onRoleComplete('domainExpert', {
    role: 'Domain Expert',
    icon: '📚',
    focus: 'Deep domain knowledge',
    content: expertContent,
    color: '#3B82F6'
  });

  console.log('[DxO] Step 4: Data Analyst starting...');
  const analystPrompt = getDxOPrompts.analyst(question, `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}`);
  const analystContent = await callLLM(analystPrompt);
  console.log('[DxO] Step 4: Data Analyst complete');
  onRoleComplete('dataAnalyst', {
    role: 'Data Analyst',
    icon: '📊',
    focus: 'Quantitative reasoning',
    content: analystContent,
    color: '#10B981'
  });

  console.log('[DxO] Step 5: Final Decision starting...');
  const finalPrompt = getDxOPrompts.final(question, 
    `Lead's Analysis:\n${leadContent}\n\nReviewer's Critique:\n${reviewerContent}\n\nExpert Input:\n${expertContent}\n\nAnalyst's Data:\n${analystContent}`
  );
  const finalContent = await callLLM(finalPrompt);
  console.log('[DxO] Step 5: Final Decision complete');
  onRoleComplete('finalDecision', {
    role: 'Final Decision',
    icon: '✨',
    title: 'Synthesized Recommendation',
    content: finalContent,
    color: '#F59E0B',
    revisions: []
  });
};
