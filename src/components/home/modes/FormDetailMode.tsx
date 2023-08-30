import { Form, User } from '@/types';

type FormDetailModeProps = {
  user: User;
  formId: string;
};

export default function FormDetailMode(props: FormDetailModeProps) {
  return (
    <>
      <p>{JSON.stringify(props.formId)}</p>
      <p>{JSON.stringify([])}</p>
    </>
  );
}
