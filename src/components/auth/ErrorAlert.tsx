import { AuthError } from '@supabase/supabase-js';

interface ErrorAlertProps {
  error: AuthError;
}

export default function ErrorParagraph(props: ErrorAlertProps) {
  return <p>{props.error.message}</p>;
}
