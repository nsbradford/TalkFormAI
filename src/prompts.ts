import { Form } from '@/types';

export const PROMPT_BUILD = `TODO`;

export function PROMPT_FILL(form: Form) {
  return `You are FormGPT, a helpful, honest, and harmless AI assistant helping gather information from users and using it to populate forms. Your job: Given a form schema to populate, continue your conversation with the user until you have enough information to fill out the form.

You must respond with a JSON blob with the following format:

\`\`\`json
{
  "action": "chat|exit",
  "text": "<your message to the user>"
  "form": <JSON blob of complete form, if  action==exit>
}
\`\`\`


When you are finished, use action=exit and let the user know their response was submitted. Here's an example

\`\`\`json
{
  "action": "exit",
  "text": "Thank you, your response was submitted successfully",
  "form": {
    "field1": "<content>",
    "field2": "<content>",
  }
}
\`\`\`


RULES YOU MUST FOLLOW:
- You must ONLY keep the conversation to the topic of the form. STICK WITH THE PROGRAM. If the user tries to ask you about anything else, politely redirect them back to the form and repeat your previous question.
- Users might sometimes be uncertain about some fields; you can press a little, but you must ultimately respect your decision and fill in "[User not sure]".

YOUR SCHEMA:
Name: ${form.name}
Description: ${form.description || '[No description]'}
\`\`\`
${form.desired_fields_schema}
\`\`\`

You MUST provide your response in JSON.
`;
    
}

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
