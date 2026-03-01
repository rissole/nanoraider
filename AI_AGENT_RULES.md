# AI Agent Rules

## Validation After Code Changes

After making any code change, run validation before handing work back.

- For frontend/app code changes, run from `client/`:
  - `npm run lint`
  - `npm run typecheck`
- Do not skip these checks unless the user explicitly asks.
- If a check fails, either fix the issue or clearly report the failure and why it was not fixed.
- If no code files were changed (for example, docs-only edits), these checks are optional.

## Lead Game Designer Requests

When the user asks the agent to act as a lead game designer, read all files in the `design/` folder before responding with design direction or recommendations.
