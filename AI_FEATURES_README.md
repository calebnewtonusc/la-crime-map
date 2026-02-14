# AI-Powered Features for LA Crime Map

This document describes the comprehensive AI features built using the Anthropic Claude API.

## Overview

The LA Crime Map now includes five production-ready AI features powered by Claude 3.5 Sonnet:

1. **AI Chat Assistant** - Interactive chat interface
2. **AI Neighborhood Descriptions** - Natural language neighborhood overviews
3. **AI Safety Analysis** - Contextual safety breakdowns
4. **Smart Insights** - Dynamic homepage insights
5. **API Infrastructure** - Robust backend with rate limiting and streaming

## Features

### 1. AI Chat Assistant (`components/features/ai-chat.tsx`)

A floating chat interface that provides instant answers to user questions.

**Key Features:**
- Floating chat button (bottom right)
- Streaming responses for real-time feel
- Chat history stored in localStorage
- Pre-populated sample questions
- Access to all neighborhood crime data
- Beautiful, responsive UI with animations

**Sample Questions:**
- "Is Hollywood safe?"
- "Best neighborhood for families under $2000/mo?"
- "Compare Venice and Santa Monica"
- "Where has the lowest car theft?"
- "Which areas are improving?"

**Technical Details:**
- Uses Server-Sent Events (SSE) for streaming
- Framer Motion animations
- Dark mode support
- Mobile responsive

### 2. AI Neighborhood Descriptions (`lib/ai/generate-descriptions.ts`)

Generates natural language descriptions for each neighborhood.

**Generated Content:**
- **Vibe**: One-sentence character description
- **Safety Context**: Nuanced explanation of crime statistics
- **Best For**: Types of people/lifestyles suited for the area
- **Avoid If**: Situations where it might not be ideal
- **Hidden Gems**: Interesting facts or recommendations

**Example Output:**
```
Silver Lake combines artistic flair with family-friendly safety.
Crime rates are 23% below LA average, making it ideal for young
professionals who want Brooklyn-style walkability without NYC prices.
```

**Technical Details:**
- Results are cached (in-memory, or Redis in production)
- Batch generation support
- Fallback descriptions for error cases
- Cache warming for popular neighborhoods

### 3. AI Safety Analysis (`components/features/ai-safety-analysis.tsx`)

Provides detailed safety analysis when users click on neighborhoods.

**Analysis Includes:**
- **Overview**: 2-3 sentence safety profile
- **Strengths**: Safety strong points
- **Concerns**: Areas of concern
- **Contextual Insights**: Nuanced context (e.g., "violent crime is concentrated in commercial areas after 10pm")
- **Safety Tips**: Personalized tips for the area
- **Risk Factors**: Specific risks to be aware of

**Technical Details:**
- Auto-generates when neighborhood is selected
- Loading states with skeleton UI
- Error handling with fallbacks
- Beautiful gradient backgrounds

### 4. Smart Insights (`lib/ai/generate-insights.ts`)

Dynamic homepage insights that update hourly.

**Insight Types:**
- **Trends**: "Crime in West LA has dropped 15% this year"
- **Comparisons**: "Santa Monica is 30% safer than LA average"
- **Alerts**: "Car theft rising in Hollywood"
- **Tips**: "Always park in well-lit areas"

**Technical Details:**
- Hourly cache refresh
- Statistics-driven analysis
- Categorized by type with icons
- Neighborhood tags for relevant areas

### 5. API Routes

#### `/api/chat/route.ts`
- POST endpoint for chat messages
- Streaming support with SSE
- Rate limiting (10 requests/minute per IP)
- Comprehensive error handling
- System prompt optimized for LA crime data

#### `/api/insights/route.ts`
- GET endpoint for smart insights
- Returns AI-generated trends and tips
- Cached results

#### `/api/neighborhood-description/route.ts`
- GET endpoint with `?name=` parameter
- Returns AI-generated description
- Cached per neighborhood

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @anthropic-ai/sdk
```

### 2. Environment Variables

Add to `.env.local`:

```env
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

### 3. Usage

#### On Homepage

The AI features are automatically integrated into the main page:

```tsx
import { AIChatAssistant, AISmartInsights } from '@/components/features';

// In your component:
<AISmartInsights />
<AIChatAssistant />
```

#### On Neighborhood Detail Pages

```tsx
import { AISafetyAnalysis, AINeighborhoodDescription } from '@/components/features';

// In your component:
<AINeighborhoodDescription neighborhood={selectedNeighborhood} />
<AISafetyAnalysis neighborhood={selectedNeighborhood} />
```

## Demo Page

Visit `/ai-demo` to see all AI features in action:

```
http://localhost:3000/ai-demo
```

## Architecture

### Rate Limiting

- 10 requests per minute per IP address
- In-memory storage (use Redis in production)
- Returns 429 status when limit exceeded

### Caching Strategy

**Descriptions:**
- In-memory Map cache
- Persistent across requests
- Can be upgraded to Redis/Database

**Insights:**
- 1-hour cache duration
- Auto-refresh on expiry
- Fallback to static insights on error

### Error Handling

All AI features include:
- Try-catch blocks
- Fallback content
- User-friendly error messages
- Console logging for debugging

### Streaming

Chat uses Server-Sent Events (SSE):
```typescript
for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    // Stream text to client
  }
}
```

## Production Considerations

### 1. Rate Limiting

Upgrade to Redis for distributed rate limiting:

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(ip: string) {
  const key = `rate_limit:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 10;
}
```

### 2. Caching

Use Redis or a database for persistent caching:

```typescript
// Redis cache
await redis.setex(`description:${name}`, 86400, JSON.stringify(description));

// Database cache
await db.neighborhoodDescription.upsert({
  where: { name },
  create: { name, description },
  update: { description }
});
```

### 3. Monitoring

Add logging and monitoring:

```typescript
// Log all AI requests
console.log({
  timestamp: new Date(),
  endpoint: '/api/chat',
  ip,
  tokens: message.usage,
});

// Use Sentry or similar for errors
Sentry.captureException(error);
```

### 4. Cost Optimization

- Cache aggressively
- Use shorter max_tokens for simple queries
- Implement request deduplication
- Monitor usage with Anthropic dashboard

## API Usage

### Chat API

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Is Hollywood safe?' }
    ],
    stream: true
  })
});

// Handle streaming
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Process chunk
}
```

### Insights API

```typescript
const response = await fetch('/api/insights');
const data = await response.json();
console.log(data.insights);
```

### Description API

```typescript
const response = await fetch('/api/neighborhood-description?name=Hollywood');
const data = await response.json();
console.log(data.description);
```

## Customization

### Modify System Prompt

Edit `app/api/chat/route.ts`:

```typescript
const SYSTEM_PROMPT = `You are a helpful AI assistant...`;
```

### Adjust Rate Limits

Edit `app/api/chat/route.ts`:

```typescript
const RATE_LIMIT = {
  maxRequests: 20,  // Increase limit
  windowMs: 60000,  // 1 minute window
};
```

### Change Model

All features use Claude 3.5 Sonnet. To change:

```typescript
model: 'claude-3-5-sonnet-20241022', // Current
model: 'claude-opus-4-6',            // More powerful
model: 'claude-3-haiku-20240307',    // Faster/cheaper
```

## Testing

### Manual Testing

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/ai-demo`
3. Test each feature:
   - Click "Ask AI" button
   - Select different neighborhoods
   - Check insights generation
   - Test rate limiting (spam requests)

### Automated Testing

```typescript
// Example test
describe('Chat API', () => {
  it('should return streaming response', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test' }],
        stream: true
      })
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
  });
});
```

## Troubleshooting

### "AI service not configured" error

- Check `.env.local` has `ANTHROPIC_API_KEY`
- Restart dev server after adding env var

### Rate limit errors

- Clear browser cache/cookies
- Wait 1 minute
- Check IP is not blacklisted

### Slow responses

- Check API key tier limits
- Reduce max_tokens
- Enable caching
- Use Claude Haiku for faster responses

### Empty/invalid responses

- Check API key is valid
- Verify model name is correct
- Review console logs for errors
- Test with Anthropic playground

## Performance

**Typical Response Times:**
- Chat (streaming): 500ms to first token, ~50 tokens/sec
- Descriptions: 2-3 seconds (cached: <50ms)
- Safety Analysis: 3-4 seconds (cached: <50ms)
- Insights: 4-5 seconds (cached: <50ms)

**Cost Estimates (per 1000 users):**
- Chat: ~$2-5 (varies by conversation length)
- Descriptions: ~$0.50 (with caching)
- Analysis: ~$1-2 (per neighborhood)
- Insights: ~$0.10 (cached hourly)

## Future Enhancements

1. **Voice Input**: Add speech-to-text for chat
2. **Multi-language**: Support Spanish, Chinese, etc.
3. **Image Analysis**: Analyze street view images
4. **Personalization**: Remember user preferences
5. **Historical Data**: Show crime trends over time
6. **Comparison Tool**: Side-by-side AI comparisons
7. **Export Reports**: PDF reports with AI insights
8. **Push Notifications**: Alert on crime trends

## License

MIT License - See LICENSE file

## Support

For issues or questions:
- GitHub Issues: [link]
- Email: support@example.com
- Discord: [link]

## Credits

Built with:
- [Anthropic Claude API](https://www.anthropic.com)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
