// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
import { LLMResponse } from '../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://oai.hconeai.com/v1',
  defaultHeaders: {
    "Helicone-Cache-Enabled": "true",
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LLMResponse>
) {
  // const body = req.body.completion_create;
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": "Hello!"}],
  });
  console.log(chatCompletion.choices[0].message);
  res.status(200).json({ completion: chatCompletion });
}
