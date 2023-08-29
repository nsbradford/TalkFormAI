import { ChatMessage, LLMRequest, LLMResponse } from "@/types";

export const callLLM = async (systemPrompt: string, messages: ChatMessage[]) => {
  const data: LLMRequest = {
    completion_create: {
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    },
  };
  const response = await fetch("/api/llm", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json: LLMResponse = await response.json();
  const text = json.completion.choices[0].message;
  return text;
};
