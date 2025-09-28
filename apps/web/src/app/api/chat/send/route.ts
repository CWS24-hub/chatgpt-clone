import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@workspace/db';
import { createStreamingChatCompletion, assertActiveSubscription } from '@workspace/core';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chatId, message, model, temperature, maxTokens } = await req.json();

  // Check subscription status
  const hasAccess = await assertActiveSubscription(session.user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
  }

  try {
    // Get or create chat
    let chat;
    if (chatId) {
      chat = await db.chat.findUnique({
        where: { id: chatId, userId: session.user.id },
        include: { messages: true }
      });
    } else {
      // Create new chat
      chat = await db.chat.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        },
        include: { messages: true }
      });
    }

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Save user message
    const userMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: 'user',
        content: message,
      }
    });

    // Prepare messages for OpenAI
    const messages = [
      ...chat.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // Create streaming completion
    const completion = await createStreamingChatCompletion(
      session.user.id,
      messages,
      { model, temperature, maxTokens }
    );

    // Create assistant message
    const assistantMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: '',
      }
    });

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              // Update assistant message content
              await db.message.update({
                where: { id: assistantMessage.id },
                data: { content: assistantMessage.content + content }
              });

              // Send chunk to client
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
