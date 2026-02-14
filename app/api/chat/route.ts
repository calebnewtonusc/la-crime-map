import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { laNeighborhoods } from '@/lib/data/neighborhoods';

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Prepare neighborhood data context
function prepareNeighborhoodContext() {
  const neighborhoods = laNeighborhoods.features.map((feature) => {
    const props = feature.properties;
    return {
      name: props.name,
      violentCrime: props.violentCrime,
      carTheft: props.carTheft,
      breakIns: props.breakIns,
      pettyTheft: props.pettyTheft,
      safetyScore: props.safetyScore,
      overallSafetyPercentile: props.overallSafetyPercentile,
      trendIndicator: props.trendIndicator,
    };
  });

  // Calculate LA-wide statistics
  const totalNeighborhoods = neighborhoods.length;
  const avgViolentCrime =
    neighborhoods.reduce((sum, n) => sum + n.violentCrime, 0) / totalNeighborhoods;
  const avgCarTheft =
    neighborhoods.reduce((sum, n) => sum + n.carTheft, 0) / totalNeighborhoods;
  const avgBreakIns =
    neighborhoods.reduce((sum, n) => sum + n.breakIns, 0) / totalNeighborhoods;
  const avgPettyTheft =
    neighborhoods.reduce((sum, n) => sum + n.pettyTheft, 0) / totalNeighborhoods;

  return {
    neighborhoods,
    stats: {
      totalNeighborhoods,
      avgViolentCrime: avgViolentCrime.toFixed(1),
      avgCarTheft: avgCarTheft.toFixed(1),
      avgBreakIns: avgBreakIns.toFixed(1),
      avgPettyTheft: avgPettyTheft.toFixed(1),
    },
  };
}

// System prompt for Claude
const SYSTEM_PROMPT = `You are a helpful AI assistant for the LA Crime Map, an interactive tool that helps people understand crime statistics across Los Angeles neighborhoods.

Your role is to:
1. Answer questions about neighborhood safety based on the crime data provided
2. Compare different neighborhoods when asked
3. Provide contextual insights about crime trends
4. Help users find safe neighborhoods that match their criteria (budget, family-friendly, etc.)
5. Explain crime statistics in plain, easy-to-understand language
6. Be honest about data limitations and always prioritize user safety

Important guidelines:
- Base your answers ONLY on the data provided in the context
- Be objective and data-driven, but also empathetic
- When discussing crime, provide context (e.g., "While violent crime is 8/10, this is still relatively moderate compared to national averages")
- Recommend specific neighborhoods when relevant
- If asked about areas not in the dataset, be honest that you don't have that data
- Always encourage users to visit neighborhoods in person and trust their instincts
- Don't overstate or understate risks
- Use specific numbers when relevant but also explain what they mean in practice

Tone: Friendly, helpful, informative, and trustworthy. Like a knowledgeable local friend who wants to help.`;

export async function POST(req: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { messages, stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Prepare context
    const context = prepareNeighborhoodContext();

    // Add context to the first user message
    const enhancedMessages = messages.map((msg, idx) => {
      if (idx === 0 && msg.role === 'user') {
        return {
          role: 'user',
          content: `Here is the current LA neighborhood crime data:

${JSON.stringify(context, null, 2)}

User question: ${msg.content}`,
        };
      }
      return msg;
    });

    // Handle streaming response
    if (stream) {
      const stream = await anthropic.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: enhancedMessages,
      });

      // Create a ReadableStream for SSE
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (
                chunk.type === 'content_block_delta' &&
                chunk.delta.type === 'text_delta'
              ) {
                const text = chunk.delta.text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: enhancedMessages,
      });

      const text =
        message.content[0].type === 'text' ? message.content[0].text : '';

      return NextResponse.json({ text });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred processing your request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
