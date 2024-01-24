import { AuthError, Session } from '@supabase/supabase-js';

type ErrorModeProps = {
  session: Session | null;
  error: AuthError | null;
};

export default function Error(props: ErrorModeProps) {
  return <p>{JSON.stringify(props.error?.message)}</p>;
}
