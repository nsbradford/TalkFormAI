# <img src="./public/talkform.png" alt="Talkform Icon" width="25"> TalkForm.AI

Create and fill forms with chat.

![Vercel](https://img.shields.io/github/deployments/nsbradford/TalkFormAI/production?logo=vercel&label=Vercel%20deployment) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/nsbradford/talkformai/playwright.yml?label=e2e%20tests) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Chat to create
<img width="433" alt="image" src="https://github.com/nsbradford/TalkFormAI/assets/6633811/f8e97719-191f-44e2-8cbe-8871e3880939">

### Chat to fill
<img width="536" alt="image" src="https://github.com/nsbradford/TalkFormAI/assets/6633811/b1e906db-ae13-4829-8322-b2531f08d3c3">

### Your data stays structured
<img width="534" alt="image" src="https://github.com/nsbradford/TalkFormAI/assets/6633811/be32d5c6-51c0-4942-9d1c-290f947b2a59">


## Why

Tired of lame, sad forms? Annoyed with tedious form builders? Feeling limited in what kinds of custom validations and logic you can express? You're in luck: [text is the universal interface](https://scale.com/blog/text-universal-interface), and so [TalkForm.AI](https://www.talkform.ai/) is here to help.

Simply chat to create a form, and chat to fill it. The field types are inferred automatically by an LLM, and all your form responses remain structured according to the inferred schema for easy analysis. And you get unlimited power to do custom validations and complicated logic.

Anything you can dream, you can build. Truly, we live in a golden age of technology.

## Demo

Head over to [talkform.ai](https://www.talkform.ai/) to try it out!

> :warning: **WARNING**: TalkForm.AI is in early development. Use at own risk.


## Local dev (outside a dev container)
This is a [Next.js](https://nextjs.org/) project. You'll need **Node** (probably using **[nvm](https://github.com/nvm-sh/nvm)**) and **[yarn](https://yarnpkg.com/)**.

### Secrets

We use Doppler for secrets, see [getting started docs](https://docs.doppler.com/docs/install-cli). Or, put everything in a `.env.local` file.

### Install dependencies

```bash
yarn
```

### Run development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you make edits.

### Lint

Uses **[eslint](https://eslint.org/)** to enforce lint rules.

```bash
yarn lint:fix
```

### Format

Uses **[prettier](https://prettier.io/)** to enforce standard code formatting.

```bash
yarn format
```

### Test

uses Playwright

```bash
yarn test:e2e
```

### Create an optimized production build

Useful to see what will actually be released.

```bash
yarn build
```

## Working in a Dev Container
Add this to your .zshrc - see [this discussion](https://community.doppler.com/t/vscode-container-support/104/2)
```bash
export DOPPLER_CLI_TOKEN=$(doppler configure get token --plain)
```
Then, when you open up the project in VSCode, just click "Reopen in Container".

## Open in GitPod
- Add to your gitpod.io/settings Default Workspace Image: <your/image:tag>
- Go to https://gitpod.io/#github.com/nsbradford/talkformai
- To open up a specific folder, add to the end of the gitpod URL: `gitpod.io/?folder=/your/folder`


## About

See our [about page](https://www.talkform.ai/about).
