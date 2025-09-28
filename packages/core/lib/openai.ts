import OpenAI from 'openai';
import { assertActiveSubscription } from './billing/entitlement';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ALLOWED_MODELS = (process.env.ALLOWED_MODELS || 'gpt-4o,gpt-4o-mini,gpt-3.5-turbo').split(',');

export async function createChatCompletion(
  userId: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  // Check subscription status
  const hasAccess = await assertActiveSubscription(userId);
  if (!hasAccess) {
    throw new Error('Subscription required');
  }

  const model = options.model || 'gpt-4o';
  if (!ALLOWED_MODELS.includes(model)) {
    throw new Error(`Model ${model} is not allowed`);
  }

  return openai.chat.completions.create({
    model,
    messages: messages as any,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
    stream: true,
  });
}

export async function createStreamingChatCompletion(
  userId: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const completion = await createChatCompletion(userId, messages, options);
  return completion;
}
