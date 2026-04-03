import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/chatbot-profile'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[chat/route] Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'Chatbot not configured' }, { status: 503 })
    }

    // Call OpenAI API with streaming
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using gpt-4o for its high reasoning capabilities
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // keep last 10 messages for context
        ],
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!openAiRes.ok) {
      const err = await openAiRes.text()
      console.error('[chat/route] OpenAI error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openAiRes.body?.getReader()
        if (!reader) { controller.close(); return }

        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

          for (const line of lines) {
            const data = line.replace('data: ', '').trim()
            if (data === '[DONE]') { controller.close(); return }
            try {
              const json = JSON.parse(data)
              const text = json.choices?.[0]?.delta?.content ?? ''
              if (text) controller.enqueue(new TextEncoder().encode(text))
            } catch {
              // skip malformed chunks
            }
          }
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[chat/route] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
