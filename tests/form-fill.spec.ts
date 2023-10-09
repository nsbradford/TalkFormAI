import { test, expect, Page } from '@playwright/test';

async function runTestScenario(
  page: Page,
  formId: string,
  messages: string[],
  expected: object
) {
  // Navigate to the specified URL
  await page.goto(`http://localhost:3000/forms/fill/${formId}`);

  for (const message of messages) {
    // Wait for input to be enabled and visible
    const inputSelector = 'input[type="text"]';
    await page.waitForSelector(inputSelector, { state: 'visible' });

    // Type the message in the input
    await page.fill(inputSelector, message);

    // Press 'Enter' to submit the message
    await page.press(inputSelector, 'Enter');
  }

  // Wait for the submission modal
  await page.waitForSelector('#submissionBox', { state: 'attached' });

  // Verify that the submission modal has the expected content
  const modalContent = await page.textContent('#submissionBox p');
  const parsed = JSON.parse(modalContent || '');
  expect(parsed).toEqual(expected);
}

// Define your list of test scenarios
const testScenarios = [
  {
    name: 'Simple RSVP',
    formId: 'bb16be91-9ba7-40b8-8e3d-ead3cf3184ca',
    messages: [
      'John Doe',
      'jd@example.com',
      'Big Tech Co.',
      'Software Engineer',
      'github.com/jd123456',
      'PostHog',
    ],
    expected: {
      name: 'John Doe',
      email: 'jd@example.com',
      company: 'Big Tech Co.',
      job_title: 'Software Engineer',
      marketing_technologies: 'PostHog',
      github: 'github.com/jd123456',
    },
  },
  {
    name: 'public-facing demo',
    formId: '5771953d-a003-4969-9071-fcfff4c5bb10',
    messages: [
      'Nick',
      'e@e.co',
      'big tech co',
      'eng manager',
      'https://github.com/nsbradford',
      'google analytics and Posthog',
    ],
    expected: {
      name: 'Nick',
      email_address: 'e@e.co',
      company: 'big tech co',
      job_title: 'eng manager',
      github_username: 'nsbradford',
      technologies_used: 'google analytics, Posthog',
    },
  },
];

// Iterate through your scenarios to run the tests
for (const scenario of testScenarios) {
  test(`Chat component e2e test: ${scenario.name}`, async ({ page }) => {
    await runTestScenario(
      page,
      scenario.formId,
      scenario.messages,
      scenario.expected
    );
  });
}
