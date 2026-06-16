# ARIA — AI Executive Assistant

A modern, secure Progressive Web App for AI-powered executive assistance.

## Features

✨ **Core Capabilities**
- 📧 Email drafting and communication
- 📅 Meeting scheduling and management
- 📝 Meeting notes & summarization
- ✅ Task & to-do management
- 🔍 Research & executive briefings
- ✈️ Travel planning & itineraries

🔐 **Security Features**
- Backend API proxy (no exposed API keys)
- HTML sanitization
- Input validation & rate limiting
- CORS protection

📱 **Progressive Web App**
- Offline-capable with Service Worker caching
- Home screen installation
- Dark mode support
- Mobile-optimized UI

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aniketcreates322-web/aria-assistant.git
cd aria-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API key to `.env`:
```
ANTHROPIC_API_KEY=your_key_here
PORT=3000
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```

6. Open http://localhost:3000 in your browser

## Development

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST /api/chat
Send a message and receive an AI response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Draft an email" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Sir, here is a professional email draft..."
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "environment": "development"
}
```

## Architecture

```
┌─────────────────────┐
│  Frontend (PWA)     │
│  - Vue-free HTML    │
│  - Secure client    │
│  - Dark mode        │
└──────────┬──────────┘
           │ HTTPS
┌──────────▼──────────┐
│ Backend (Express)   │
│ - API proxy         │
│ - Rate limiting     │
│ - Error handling    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Anthropic API       │
│ claude-3-5-sonnet   │
└─────────────────────┘
```

## Deployment

### Vercel
1. Push to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Notes

- ✅ API keys stored server-side only
- ✅ All client requests proxied through backend
- ✅ Input validation & sanitization
- ✅ Rate limiting on API calls
- ✅ CORS protection
- ✅ Content Security Policy ready

## Contributing

Contributions welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please create a GitHub issue.

## Roadmap

- [ ] Message history persistence
- [ ] Conversation export (PDF/Email)
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Calendar integration
- [ ] Email integration
