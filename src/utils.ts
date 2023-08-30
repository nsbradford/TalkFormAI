import { ChatMessage, LLMRequest, LLMResponse, User } from '@/types';
import {
  Session,
  SupabaseClient,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/supabase';

export const callLLM = async (
  systemPrompt: string,
  messages: ChatMessage[]
) => {
  const data: LLMRequest = {
    completion_create: {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    },
  };
  const response = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json: LLMResponse = await response.json();
  const text = json.completion.choices[0].message;
  return text;
};

export async function getUserFromSupabase(
  session: Session | null,
  supabase: SupabaseClient<Database>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<User | undefined> {
  if (!session) {
    return;
  }
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', session?.user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return;
  } else if (data === null) {
    console.error('No user found');
    return;
  } else {
    setUser(data);
  }
}
