import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { mockCouncilResponses, mockDxOResponses, simulateDelay } from './mockData.js';
import { processCouncilRequest, processDxORequest, processDxORequestStreaming } from './llmService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: config.useMock ? 'mock' : 'live',
    timestamp: new Date().toISOString()
  });
});

// Council endpoint
app.post('/api/council', async (req, res) => {
  try {
    const { question, selectedMembers, chairmanModel } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`[Council] Processing question: ${question.substring(0, 50)}...`);
    console.log(`[Council] Selected members: ${selectedMembers?.join(', ') || 'default'}`);
    console.log(`[Council] Chairman model: ${chairmanModel || 'default'}`);

    if (config.useMock) {
      // Simulate API delay for realistic demo feel
      await simulateDelay(2000);
      
      return res.json({
        success: true,
        mode: 'mock',
        question,
        data: mockCouncilResponses
      });
    }

    // Real LLM processing with selected members
    const result = await processCouncilRequest(question, selectedMembers, chairmanModel);
    
    return res.json({
      success: true,
      mode: 'live',
      question,
      data: result
    });

  } catch (error) {
    console.error('[Council] Error:', error);
    res.status(500).json({ 
      error: 'Failed to process council request',
      message: error.message 
    });
  }
});

// DxO endpoint
app.post('/api/dxo', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`[DxO] Processing question: ${question.substring(0, 50)}...`);

    if (config.useMock) {
      // Simulate API delay for realistic demo feel
      await simulateDelay(2500);
      
      return res.json({
        success: true,
        mode: 'mock',
        question,
        data: mockDxOResponses
      });
    }

    // Real LLM processing
    const result = await processDxORequest(question);
    
    return res.json({
      success: true,
      mode: 'live',
      question,
      data: result
    });

  } catch (error) {
    console.error('[DxO] Error:', error);
    res.status(500).json({ 
      error: 'Failed to process DxO request',
      message: error.message 
    });
  }
});

// Streaming endpoint for Council (progressive loading)
app.post('/api/council/stream', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const members = mockCouncilResponses.members;
    
    // Send each member's response with delay
    for (let i = 0; i < members.length; i++) {
      await simulateDelay(1000 + Math.random() * 1000);
      res.write(`data: ${JSON.stringify({ type: 'member', data: members[i] })}\n\n`);
    }

    // Send chairman response
    await simulateDelay(1500);
    res.write(`data: ${JSON.stringify({ type: 'chairman', data: mockCouncilResponses.chairman })}\n\n`);
    
    // Signal completion
    res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('[Council Stream] Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

// Streaming endpoint for DxO (sequential role loading)
app.post('/api/dxo/stream', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`[DxO Stream] Processing question: ${question.substring(0, 50)}...`);

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (config.useMock) {
      const roles = ['leadResearcher', 'criticalReviewer', 'domainExpert', 'dataAnalyst', 'finalDecision'];
      
      // Send each role's response sequentially with delay
      for (const role of roles) {
        await simulateDelay(1500 + Math.random() * 1000);
        res.write(`data: ${JSON.stringify({ type: role, data: mockDxOResponses[role] })}\n\n`);
      }
    } else {
      // Live LLM processing with streaming
      await processDxORequestStreaming(question, (roleType, roleData) => {
        res.write(`data: ${JSON.stringify({ type: roleType, data: roleData })}\n\n`);
      });
    }
    
    // Signal completion
    res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('[DxO Stream] Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

// Configuration endpoint (for debug/demo)
app.get('/api/config', (req, res) => {
  res.json({
    useMock: config.useMock,
    availableModels: config.availableModels,
    councilMembers: config.councilMembers.map(m => ({ id: m.id, name: m.name, model: m.model, provider: m.provider, color: m.color })),
    dxoRoles: config.dxoRoles
  });
});

// Serve static files in production (only if dist folder exists)
const distPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start server
app.listen(config.port, () => {
  console.log(`\n🚀 DeepR Backend Orchestrator`);
  console.log(`   Running on: http://localhost:${config.port}`);
  console.log(`   Mode: ${config.useMock ? '🎭 Mock Data' : '🔴 Live LLM APIs'}`);
  console.log(`\n   Endpoints:`);
  console.log(`   - POST /api/council - LLM Council framework`);
  console.log(`   - POST /api/dxo - DxO Decision framework`);
  console.log(`   - POST /api/council/stream - Streaming council responses`);
  console.log(`   - POST /api/dxo/stream - Streaming DxO responses`);
  console.log(`   - GET /api/health - Health check`);
  console.log(`   - GET /api/config - Configuration info\n`);
});
