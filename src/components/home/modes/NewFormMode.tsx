import { useState, useEffect } from 'react';
import { Database } from '../../../../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChatMessage, User } from '@/types';
import { v4 } from 'uuid';
import { callLLM } from '@/utils';
import { PROMPT_BUILD } from '@/prompts';

type NewFormModeProps = {
  user: User;
  onCancelClick: () => void;
  onSuccessfulSubmit: () => void;
};

export default function NewFormMode(props: NewFormModeProps) {
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [title, setTitle] = useState('');
  const [fieldsGuidance, setFieldsGuidance] = useState('');
  const [fieldsSchema, setFieldsSchema] = useState('{}');

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const fields_schema = { instructions: formTopic };

    await supabase.from('forms').insert([
      {
        description: description,
        raw_instructions: formTopic,
        fields_guidance: fieldsGuidance,
        fields_schema: fields_schema,
        id: v4(),
        is_open: true,
        name: title,
        user_id: props.user.id,
      },
    ]);

    setIsLoading(false);
    props.onSuccessfulSubmit();
  }

  const transitionToStep2WithLLM = async () => {
    setStep(1.5);
    const conversationThread: ChatMessage[] = [
      {
        role: 'user',
        content: 'Here is a short text description of what I want to create a survey form about: ' + formTopic + '\n' + 'What should the title of this survey form be?',
      }
    ]
    const titleResponse = await callLLM(PROMPT_BUILD, conversationThread);
    if (!titleResponse) {
      console.error('No response from LLM');
      setStep(1);
      return;
    }
    setTitle(removeStartAndEndQuotes(titleResponse.content) || '')

    conversationThread.push(titleResponse);
    conversationThread.push({
      role: 'user',
      content: 'Create a short description of this survey form.  This description will be given to a person who is in charge of administering the form data collection.  This person will use this description to understand what the form is about, so that they can collect the correct information from respondents.  Don\'t include information that is not relevant to the form, or state that this is a form.  This survey administrator already knows that, instead they care about information relation the forms content.  For example, if you want to collect a respondent\'s name and age, you can write: "This form is to collect the names and ages of people attending a birthday party."',
    })
    const descriptionResponse = await callLLM(PROMPT_BUILD, conversationThread);
    if (!descriptionResponse) {
      console.error('No response from LLM');
      setStep(1);
      return;
    }
    setDescription(removeStartAndEndQuotes(descriptionResponse.content) || '')

    conversationThread.push(descriptionResponse);
    conversationThread.push({
      role: 'user',
      content: 'Write any guidance that will help respondents fill out this form, such as conditional information to collect or how to answer questions.  The survey administrator will reference this guidence when deciding which follow up questions to ask or how to interpret the answers.  For example, if you want to collect a RSVP for a birthday party, including the number of guests attending, you may write "Please include the number of guests attending the birthday party, but only if the RSVP is yes." because it doesn\'t make sense to ask for the number of guests if the respondent is not attending.',
    })

    const fieldsGuidanceResponse = await callLLM(PROMPT_BUILD, conversationThread);
    if (!fieldsGuidanceResponse) {
      console.error('No response from LLM');
      setStep(1);
      return;
    }
    setFieldsGuidance(removeStartAndEndQuotes(fieldsGuidanceResponse.content) || '')

    conversationThread.push(fieldsGuidanceResponse);
    conversationThread.push({
      role: 'user',
      content: 'Now return a JSON object that will serve as a template for the form responses.  This object should have keys that are strings and values that are strings.  The keys are the names of the fields that the survey administrator should attempt to obtain.  They values should be descriptions of those fields, including any formatting information or non-obvious ways to validate the provided information.  For example, if you want to collect a respondent\'s name and age, you can write: {"name": "name of the respondent", "age": "age of the respondent"}',
    })

    const fieldsSchemaResponse = await callLLM(PROMPT_BUILD, conversationThread);
    if (!fieldsSchemaResponse) {
      console.error('No response from LLM');
      setStep(1);
      return;
    }
    const fieldsSchema = fieldsSchemaResponse.content || '{}';
    const fieldsSchemaJSON = JSON.parse(fieldsSchema);
    setFieldsSchema(fieldsSchemaJSON);
    setStep(2)

  }

  const renderStepContent = () => {
    if (step === 1) {

      return (
        <div className="sm:col-span-4">
          <label
            htmlFor="formTopic"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            What is your form about?
          </label>
          <div className="mt-2">
            <textarea
              id="formTopic"
              rows={5}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={formTopic}
              onChange={(e) => setFormTopic(e.target.value)}
              placeholder="Birthday party RSVP, # of guests, dietary restrictions..."
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={transitionToStep2WithLLM}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Next
            </button>
          </div>
        </div>
      );
    } else if (step === 1.5) {
      return <div className="col-span-full">Loading...</div>;
    } else if (step === 2) {
      return (
        <div className="col-span-full">
          <div className="sm:col-span-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div className="mt-2">
              <input 
                type="text"
                id="title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Birthday party RSVP"
              />
            </div>

            <label
              htmlFor="description"
              className="block mt-4 text-sm font-medium leading-6 text-gray-900"
            >
              Description (Optional)
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                rows={5}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adding a description can help us gather the correct information from respondents..."
              />
            </div>

            <label
              htmlFor="fields_guidance"
              className="block mt-4 text-sm font-medium leading-6 text-gray-900"
            >
              Guidance (Optional)
            </label>
            <div className="mt-2">
              <textarea
                id="fields_guidance"
                rows={5}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={fieldsGuidance}
                onChange={(e) => setFieldsGuidance(e.target.value)}
                placeholder="Write any information that will help respondents fill out this form..."
              />
            </div>
            <div>
              <div className="mt-4">
                Fields Schema:
                <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(fieldsSchema, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {renderStepContent()}
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {step === 2 && (
          <button
            type="button"
            onClick={props.onCancelClick}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
        )}
        {step === 2 && (
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        )}
      </div>
    </form>
  );
}

function removeStartAndEndQuotes(content: string | null): import("react").SetStateAction<string> {
  throw new Error('Function not implemented.');
}
