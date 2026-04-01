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

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Chatbot not configured' }, { status: 503 })
    }

    // Call Groq API with streaming
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // keep last 10 messages to stay within context
        ],
        max_tokens: 512,
        temperature: 0.4,
        stream: true,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('[chat/route] Groq error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body?.getReader()
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
