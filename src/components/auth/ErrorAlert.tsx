import { AuthError } from '@supabase/supabase-js';

interface ErrorAlertProps {
  error: AuthError;
}

export default function ErrorAlert(props: ErrorAlertProps) {
  return <p>{props.error.message}</p>;
}
