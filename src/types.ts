import OpenAI from 'openai';

export type LLMRequest = {
  completion_create: OpenAI.CompletionCreateParamsNonStreaming
}

export type LLMResponse = {
  completion: OpenAI.Chat.Completions.ChatCompletion
}

export type ChatMessage = OpenAI.Chat.Completions.CreateChatCompletionRequestMessage
// {
//   role: string; //"user" | "assistant";
//   content: string;
// };