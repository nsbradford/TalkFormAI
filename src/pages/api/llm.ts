// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { LLMRequest, LLMResponse } from '../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://oai.hconeai.com/v1',
  defaultHeaders: {
    'Helicone-Cache-Enabled': 'true',
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LLMResponse>
) {
  const llmRequest: LLMRequest = req.body;
  console.log(`LLM middleware: got request: ${JSON.stringify(llmRequest)}`);
  const completion = await openai.chat.completions.create(
    llmRequest.completion_create
  );
  console.log(`LLM middleware: got completion: ${JSON.stringify(completion)}`);
  const response: LLMResponse = { completion };
  res.status(200).json(response);
}
