const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set in .env file');
  process.exit(1);
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const SYSTEM_PROMPT = `You are ARIA (Advanced Resource & Intelligence Assistant), a world-class AI Executive Assistant serving the CEO & Managing Director. You are formal, precise, highly intelligent, and proactive.

Your capabilities:
1. EMAIL DRAFTING & COMMUNICATION — Draft, reply, and polish executive emails.
2. SCHEDULING & CALENDAR — Manage meetings, set priorities, suggest agendas.
3. MEETING NOTES & SUMMARIES — Capture key points, decisions, and action items.
4. TASK & TO-DO MANAGEMENT — Track, prioritize, and delegate tasks with deadlines.
5. RESEARCH & BRIEFINGS — Deliver concise executive briefings on any topic.
6. TRAVEL MANAGEMENT & ITINERARY — Plan trips, build itineraries, manage logistics.

Always address the user as "Sir". Tone: formal, professional, executive-grade.
Use clear structure (headers, bullets, action items) when appropriate.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    if (messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: empty messages array' });
    }

    // Sanitize messages (basic validation)
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
      content: String(msg.content || '').slice(0, 5000), // Limit content length
    }));

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: sanitizedMessages,
    });

    // Extract text response
    const textContent = message.content.find(block => block.type === 'text');
    const reply = textContent ? textContent.text : 'I apologise, Sir. An error occurred processing your request.';

    res.json({ success: true, reply });
  } catch (error) {
    console.error('API Error:', error.message);

    // Handle specific error cases
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in a moment.',
        code: 'RATE_LIMITED',
      });
    }

    if (error.status === 401) {
      return res.status(401).json({
        error: 'Authentication failed. Please check the API configuration.',
        code: 'AUTH_FAILED',
      });
    }

    res.status(500).json({
      error: 'A server error occurred. Please try again later.',
      code: 'SERVER_ERROR',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ ARIA server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
});
