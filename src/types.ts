import type OpenAI from 'openai';
import type { Database } from '../types/supabase';

export type LLMRequest = {
  completion_create: OpenAI.Chat.CompletionCreateParamsNonStreaming;
};

export type LLMResponse = {
  completion: OpenAI.Chat.Completions.ChatCompletion;
};

export type ChatMessage =
  OpenAI.Chat.Completions.CreateChatCompletionRequestMessage;

export type User = Database['public']['Tables']['users']['Row'];
