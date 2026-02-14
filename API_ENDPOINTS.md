# API Endpoints Documentation

Complete reference for all AI-powered API endpoints.

## Base URL

**Development**: `http://localhost:3000`
**Production**: `https://la-crime-map-ruddy.vercel.app`

## Authentication

All endpoints use server-side authentication with the Anthropic API key. No client-side authentication required.

---

## 1. Chat API

### POST `/api/chat`

Send messages to the AI assistant and get contextual responses about LA crime data.

#### Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Is Hollywood safe?"
    }
  ],
  "stream": true
}
```

**Parameters:**
- `messages` (required): Array of message objects
  - `role`: "user" or "assistant"
  - `content`: Message text
- `stream` (optional): Boolean, default `true`
  - `true`: Returns Server-Sent Events stream
  - `false`: Returns complete response

#### Response (Non-streaming)

```json
{
  "text": "Hollywood's safety varies by area and time. Violent crime is rated 8/10, which is moderate to high. The main tourist areas along Hollywood Blvd are generally safe during the day with heavy foot traffic and police presence..."
}
```

#### Response (Streaming)

```
data: {"text":"Hollywood's"}
data: {"text":" safety"}
data: {"text":" varies"}
...
data: [DONE]
```

#### Error Responses

```json
// 400 Bad Request
{
  "error": "Invalid request: messages array required"
}

// 429 Too Many Requests
{
  "error": "Rate limit exceeded. Please try again later."
}

// 500 Internal Server Error
{
  "error": "An error occurred processing your request",
  "details": "API key not configured"
}
```

#### Rate Limits

- 10 requests per minute per IP address
- Resets every 60 seconds

#### Example (JavaScript)

```javascript
// Non-streaming
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Is Hollywood safe?' }
    ],
    stream: false
  })
});

const data = await response.json();
console.log(data.text);

// Streaming
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Compare Venice and Santa Monica' }
    ],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;

      try {
        const parsed = JSON.parse(data);
        console.log(parsed.text); // Stream each token
      } catch (e) {}
    }
  }
}
```

#### Example (cURL)

```bash
# Non-streaming
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Is Hollywood safe?"}],
    "stream": false
  }'

# Streaming
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "messages": [{"role": "user", "content": "Compare neighborhoods"}],
    "stream": true
  }'
```

---

## 2. Insights API

### GET `/api/insights`

Get AI-generated insights about LA crime trends, comparisons, and tips.

#### Request

No parameters required.

```
GET /api/insights
```

#### Response

```json
{
  "insights": [
    {
      "title": "Westside Safety Premium",
      "description": "Neighborhoods like Beverly Hills and Santa Monica consistently show lower crime rates, making them ideal for families prioritizing safety.",
      "type": "comparison",
      "neighborhoods": ["Beverly Hills", "Santa Monica", "West LA"]
    },
    {
      "title": "Car Theft Awareness",
      "description": "Car theft rates are notably higher in Venice and Hollywood. Always park in well-lit areas and use visible steering wheel locks.",
      "type": "alert",
      "neighborhoods": ["Venice", "Hollywood"]
    },
    {
      "title": "Improving Neighborhoods",
      "description": "Crime trends are improving in several areas, offering good value for those willing to be early adopters in gentrifying neighborhoods.",
      "type": "trend",
      "neighborhoods": ["Echo Park", "Highland Park", "Arts District"]
    },
    {
      "title": "Safety Tips for Urban Living",
      "description": "Regardless of neighborhood, always stay aware of your surroundings, especially after dark. Trust your instincts and avoid isolated areas at night.",
      "type": "tip"
    }
  ]
}
```

**Insight Types:**
- `trend`: Crime trend observations
- `comparison`: Neighborhood comparisons
- `alert`: Important safety alerts
- `tip`: General safety tips

#### Caching

- Results cached for 1 hour
- Automatic refresh on expiry
- Cache key: Global (same for all users)

#### Error Responses

```json
// 500 Internal Server Error
{
  "error": "Failed to generate insights",
  "details": "API rate limit exceeded"
}
```

#### Example (JavaScript)

```javascript
const response = await fetch('/api/insights');
const data = await response.json();

data.insights.forEach(insight => {
  console.log(`${insight.title}: ${insight.description}`);
  if (insight.neighborhoods) {
    console.log('Neighborhoods:', insight.neighborhoods.join(', '));
  }
});
```

#### Example (cURL)

```bash
curl http://localhost:3000/api/insights
```

---

## 3. Neighborhood Description API

### GET `/api/neighborhood-description`

Get AI-generated natural language description for a specific neighborhood.

#### Request

```
GET /api/neighborhood-description?name=Hollywood
```

**Query Parameters:**
- `name` (required): Neighborhood name (must match exactly)

#### Response

```json
{
  "description": {
    "vibe": "Hollywood blends tourist glitz with gritty urban reality, offering excitement and entertainment around the clock.",
    "safetyContext": "Crime levels are moderate to high (8/10 violent crime), but most incidents occur in commercial areas and tourist zones. Residential neighborhoods to the north and south tend to be safer. The high crime rate is partly due to dense foot traffic and concentrated nightlife.",
    "bestFor": [
      "Entertainment industry professionals",
      "Young adults seeking nightlife",
      "Tourists (for short stays)",
      "Those who prioritize location over safety"
    ],
    "avoidIf": [
      "Families with young children",
      "Looking for quiet residential feel",
      "Very concerned about property crime"
    ],
    "hiddenGems": "The Hollywood Bowl offers world-class outdoor concerts with stunning city views. The nearby hiking trails in Runyon Canyon provide an urban escape with panoramic vistas."
  }
}
```

#### Valid Neighborhood Names

Must match exactly (case-sensitive):

- Downtown LA
- Koreatown
- Echo Park
- Silver Lake
- Los Feliz
- Hollywood
- West Hollywood
- Santa Monica
- Venice
- Marina del Rey
- West LA
- Beverly Hills
- Bel Air
- Brentwood
- Culver City
- Palms
- Van Nuys
- North Hollywood
- Sherman Oaks
- Studio City
- Encino
- Burbank
- Glendale
- Inglewood
- Compton
- South LA
- Watts
- Pasadena
- Alhambra
- East LA
- El Monte
- Long Beach
- Torrance
- Redondo Beach
- Manhattan Beach
- El Segundo

#### Caching

- Results cached per neighborhood
- Cache never expires (descriptions are stable)
- Cache key: `description:${name}`

#### Error Responses

```json
// 400 Bad Request
{
  "error": "Neighborhood name is required"
}

// 404 Not Found
{
  "error": "Neighborhood not found"
}

// 500 Internal Server Error
{
  "error": "Failed to generate description",
  "details": "API connection timeout"
}
```

#### Example (JavaScript)

```javascript
const name = 'Hollywood';
const response = await fetch(`/api/neighborhood-description?name=${encodeURIComponent(name)}`);
const data = await response.json();

console.log('Vibe:', data.description.vibe);
console.log('Safety:', data.description.safetyContext);
console.log('Best for:', data.description.bestFor.join(', '));
console.log('Avoid if:', data.description.avoidIf.join(', '));
console.log('Hidden gem:', data.description.hiddenGems);
```

#### Example (cURL)

```bash
curl "http://localhost:3000/api/neighborhood-description?name=Hollywood"

# URL encoding for spaces
curl "http://localhost:3000/api/neighborhood-description?name=Santa%20Monica"
```

---

## Common Response Headers

All endpoints include these headers:

```
Content-Type: application/json
Cache-Control: no-cache (for streaming endpoints)
```

## Error Handling Best Practices

```javascript
async function callAPI(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Show user-friendly error message
    return { error: 'Unable to fetch data. Please try again.' };
  }
}

// Usage
const insights = await callAPI('/api/insights');
if (insights.error) {
  console.error(insights.error);
} else {
  console.log(insights.insights);
}
```

## Rate Limiting Details

### Current Limits

| Endpoint | Limit | Window | Scope |
|----------|-------|--------|-------|
| `/api/chat` | 10 req | 1 min | Per IP |
| `/api/insights` | None | - | - |
| `/api/neighborhood-description` | None | - | - |

### Rate Limit Headers (Future)

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1634567890
```

### Handling Rate Limits

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages: [...] })
});

if (response.status === 429) {
  const error = await response.json();
  console.log('Rate limited:', error.error);
  // Wait 60 seconds before retrying
  setTimeout(() => retryRequest(), 60000);
}
```

## CORS Configuration

Currently allows all origins in development. For production, configure in `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
```

## Testing Endpoints

### Using Postman

1. Import this collection: [Link to Postman collection]
2. Set base URL: `http://localhost:3000`
3. Test each endpoint

### Using HTTPie

```bash
# Chat API
http POST localhost:3000/api/chat \
  messages:='[{"role":"user","content":"Is Hollywood safe?"}]' \
  stream:=false

# Insights API
http GET localhost:3000/api/insights

# Description API
http GET localhost:3000/api/neighborhood-description \
  name=="Hollywood"
```

## Monitoring & Debugging

### Enable Verbose Logging

Set environment variable:

```env
DEBUG=true
```

### Check API Logs

```bash
# View Next.js logs
npm run dev

# Check for errors
grep "Error" .next/server/app.log
```

### Monitor Anthropic Usage

Visit: https://console.anthropic.com/account/usage

## Performance Tips

1. **Use Streaming**: For chat, enable streaming for better UX
2. **Cache Aggressively**: Descriptions and insights are cached
3. **Batch Requests**: Don't make multiple rapid requests
4. **Handle Errors**: Always implement fallback content
5. **Monitor Usage**: Track API costs in Anthropic dashboard

## Security Considerations

1. **API Key**: Never expose to client-side code
2. **Rate Limiting**: Prevents abuse and cost overruns
3. **Input Validation**: All inputs are validated server-side
4. **Error Messages**: Don't expose sensitive information
5. **HTTPS**: Always use HTTPS in production

## Support

For issues or questions:
- Check documentation: `AI_FEATURES_README.md`
- Review logs: `.next/server/`
- Test in Postman/cURL
- Contact: support@example.com

## Changelog

### v1.0.0 (Current)
- Initial release
- Chat API with streaming
- Insights API with caching
- Neighborhood description API
- Rate limiting for chat endpoint

### Future Versions
- v1.1.0: Add Redis caching
- v1.2.0: Add analytics tracking
- v1.3.0: Multi-language support
