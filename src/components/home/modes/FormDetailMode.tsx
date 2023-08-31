import { Form, User, Response } from '@/types';

type FormDetailModeProps = {
  user: User;
  form: Form;
  responses: Response[];
};

export default function FormDetailMode(props: FormDetailModeProps) {
  return (
    <>
      <p>{JSON.stringify(props.form)}</p>
      <p>{JSON.stringify(props.responses)}</p>
    </>
  );
}
