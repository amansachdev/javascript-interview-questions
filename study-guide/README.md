# JavaScript Interview Study Guide

A static study checklist built from the repository's 518 numbered questions and answers. Six overlapping prompts are combined into representative study cards, leaving 512 items. Answers expand in place, questions can be searched by topic, and checked items sync through Cloud Firestore.

## Progress sync

Progress is stored in the shared Firestore document `progress/shared` in the same Firebase project used by `personal-notes`. It syncs across devices without an account. As with the shared note, anyone who opens the public site can see and change the same checklist; do not use this pattern for private progress. Firestore rules limit writes to the 518 question IDs and preserve the existing shared-note rules. If Firebase is unavailable or not configured during local development, the checklist falls back to this browser's local storage.

## How the ranking was reviewed

I reviewed the full question list and assigned every item a position and tier using three editorial factors:

1. **Breadth:** how central the concept is to JavaScript across frontend and general application work.
2. **Interview and coding relevance:** whether current JavaScript interview preparation guides repeatedly emphasize it, or use it in common implementation exercises.
3. **Transferability and currency:** whether it applies broadly today, is mainly role/runtime-specific, depends on an older practice, or is mostly a one-off output puzzle.

“Core” starts with closures and scope, `this` and function behavior, promises and event-loop ordering, data types, objects and arrays, common coding patterns, and browser event handling. “Next” contains useful supporting concepts and deeper or role-specific topics. “Optional” contains narrower APIs, legacy details, highly specialized runtime topics, and isolated output puzzles. Repeated questions on the same concept are lower than the clearest representative where possible.

The current cut is **102 Core**, **278 Next**, and **132 Optional**. Recent review moved browser storage, classic browser questions, decorators, reactive programming, and other realistic topics into Next; it also promoted cookie/storage comparisons and reflow/repaint into Core. The displayed numbers put Core first, followed by Next and Optional; within each tier, related topics are grouped and the order reflects broad usefulness before narrower detail. Treat nearby positions as a study sequence, not as a meaningful difference in measured odds.

The order draws on overlap between current frontend interview prep material such as [GreatFrontEnd’s JavaScript interview checklist](https://www.greatfrontend.com/front-end-interview-playbook/javascript) and [BFE.dev’s JavaScript interview task list](https://bigfrontend.dev/list/rzit2j8m6s7g3z6bnus). Those sources are preparation guides, not a representative dataset of actual interviews. The ranking is therefore a reasoned study order, not a claim of measured interview frequency; role, seniority, and company can change what matters.

## Run locally

From this directory:

```sh
npm ci
cp .env.example .env
# Fill in the Firebase web app values in .env, then:
npm run dev
```

Without Firebase values, the guide still works and stores progress locally. The Firebase web config is public by design; access is controlled by Firestore rules.

## GitHub Pages

The GitHub Actions workflow builds and publishes this folder whenever `study-guide/` changes on `master`. It uses the repository secrets `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`. Enable **Settings → Pages → Build and deployment → GitHub Actions** if needed. The site URL on your fork is `https://<your-github-username>.github.io/javascript-interview-questions/`.

To deploy Firestore rules from this directory, use `firebase deploy --only firestore:rules --project note-taker-692b8`. The rules file includes both the study progress rule and the existing `notes/shared` rule.
