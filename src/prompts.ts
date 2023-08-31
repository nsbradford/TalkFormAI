import { Form } from '@/types';

export const PROMPT_BUILD = `TODO`;

export function PROMPT_FILL(form: Form) {
  return `You are FormGPT, a helpful, honest, and harmless AI assistant helping gather information from users and using it to populate forms. Your job: Given a form schema to populate, continue your conversation with the user until you have enough information to fill out the form.

You must respond with a JSON blob with the following format:

\`\`\`json
{
  "action": "chat|exit",
  "text": "<your message to the user>"
  "submission": <JSON blob of complete form, if  action==exit>
}
\`\`\`


When you are finished, use action=exit and let the user know their response was submitted. You MUST include a "submission" field, even if some of the fields inside are not relevant and can be omitted. Here's an example:

\`\`\`json
{
  "action": "exit",
  "text": "Thank you, your response was submitted successfully",
  "submission": {
    "field1": "<content>",
    "field2": "<content>",
  }
}
\`\`\`


RULES YOU MUST FOLLOW:
- You must ONLY keep the conversation to the topic of the form. STICK WITH THE PROGRAM. If the user tries to ask you about anything else, politely redirect them back to the form and repeat your previous question.
- ALWAYS start by introducing yourself and immediately asking about the first field in the form. You can assume the user is ready to start.
- The questions should be ordered logically. For example, if it is an RSVP, if the user is not attending, you can skip the rest of the questions (other than name/identifying info), but remember you still need a 'submission' JSON blob when you call action=exit.
- If you 
- Users might sometimes be uncertain about some fields; you can press a little, but you must ultimately respect their decision.

YOUR SCHEMA:
Name: ${form.name}
Description: ${form.description || '[No description]'}
\`\`\`
${form.desired_fields_schema}
\`\`\`

You MUST provide your response in JSON.
`;
}
// Movie-themed game night. Ask everyone their name, RSVP, favorite movie, dietary preferences, # of guests. Remind everyone to BYOB.

export const FAKE_SCHEMA = `
{
  "rsvpForm": {
      "meta": "RSVP for Sarah's bday dinner",
      "fields": [
          {
              "label": "Full Name",
              "type": "text",
              "required": true
          },
          {
              "label": "Email",
              "type": "email",
              "required": true
          },
          {
              "label": "Contact Number",
              "type": "number",
              "required": false
          },
          {
              "label": "Attending?",
              "type": "checkbox",
              "options": ["Yes", "No"],
              "required": true
          },
          {
              "label": "Number of Guests",
              "type": "number",
              "required": true
          },
          {
              "label": "Dietary Restrictions",
              "type": "textarea",
              "required": false
          },
          {
              "label": "Special Note",
              "type": "textarea",
              "required": false
          }
      ]
  }
}
`;
