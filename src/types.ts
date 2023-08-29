import OpenAI from 'openai';

export type LLMRequest = {
  completion_create: OpenAI.Chat.CompletionCreateParamsNonStreaming
}

export type LLMResponse = {
  completion: OpenAI.Chat.Completions.ChatCompletion
}

export type ChatMessage = OpenAI.Chat.Completions.CreateChatCompletionRequestMessage