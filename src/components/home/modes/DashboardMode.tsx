import { Form, Response, User } from '@/types';

type DashboardModeProps = {
    user: User;
    forms: Form[];
    responses: Record<string, Response[]>;
    onNewFormClick: () => void;
    onFormDetailClick: (form: Form, responses: Response[]) => void;
}


export default function DashboardMode(props: DashboardModeProps) {

    if (props.forms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-semibold text-gray-900">You have no forms</h1>
                <p className="mt-2 text-sm text-gray-500">Create a form to get started</p>
                <button onClick={props.onNewFormClick}>
                    Create a form
                </button>
            </div>
        );
    } else {
        return (
            <ul role="list" className="divide-y divide-gray-100">
            <button onClick={props.onNewFormClick}>
                New form
            </button>
            {props.forms.map((f) => {
                const responsesForThisForm = props.responses[f.id] || [];
                return (
                    <li key={f.id} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="h-20 w-20 rounded-full bg-gray-500">
                            <div className="flex h-full w-full items-center justify-center text-white">
                                {props.user.email[0]}
                            </div>
                        </div>
                        <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{f.id}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{f.created_at}</p>
                        </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-gray-900">{f.desired_fields_schema}</p>
                        {responsesForThisForm.length === 0 ? (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            No responses yet, last updated at <time>{f.updated_at}</time>
                        </p>
                        ) : (
                            <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 text-gray-500">{responsesForThisForm.length}</p>
                        </div>
                        )}
                    </div>
                    </li>
                );
            })}
            </ul>
        ); 
    }
}
