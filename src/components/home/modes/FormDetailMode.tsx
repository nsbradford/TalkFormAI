import { Form, User, Response } from '@/types';
import ResponsesTable from './ResponsesTable';

type FormDetailModeProps = {
  user: User;
  form: Form;
  responses: Response[];
};

export default function FormDetailMode(props: FormDetailModeProps) {
  const badgeColor = props.form.is_open
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
  const camelCaseTitle = props.form.name.charAt(0).toUpperCase() + props.form.name.slice(1, props.form.name.length);
  return (
    <>
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <div className="flex gap-x-6 ">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {camelCaseTitle}
            </p>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeColor} ring-1 ring-inset ring-gray-500/10`}
            >
              {props.form.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {props.form.desired_fields_schema}
          </p>
        </div>
      </div>
      <ResponsesTable
        data={props.responses.map((response) => response.results as Array<Record<string, any>>)}
      />
    </>
  );
}
