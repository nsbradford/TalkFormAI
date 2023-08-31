import { User } from '@/types';

type ErrorModeProps = {
  user: User;
  errorMessage: string;
};

export default function ErrorMode(props: ErrorModeProps) {
  return <p>{props.errorMessage}</p>;
}
