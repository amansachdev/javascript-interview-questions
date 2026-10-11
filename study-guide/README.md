# JavaScript Interview Study Guide

A static, locally runnable study checklist for the 518 questions in the main README. It ranks a curated 100-question core first, keeps the other questions available by priority, and expands each answer inline from the README. Checked items are saved in browser local storage.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/study-guide/>. Progress is saved in this browser on this device and does not sync to another browser or device.

## GitHub Pages

The repository includes a GitHub Actions workflow that publishes this folder as the Pages site whenever `study-guide/` changes on `master`. Enable **Settings → Pages → Build and deployment → GitHub Actions** if needed. The site URL on your fork is `https://<your-github-username>.github.io/javascript-interview-questions/`.

## Ranking notes

“Start here” prioritizes concepts that transfer across modern JavaScript interviews: functions and scope, values and objects, arrays, async behavior, modules, browser events, and core modern syntax. “Next” adds useful depth. “Optional” contains narrower APIs, niche browser or runtime details, legacy practices, and output puzzles. This is an editorial study order, not a prediction of what a specific interviewer will ask.
