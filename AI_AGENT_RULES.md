# AI Agent Rules

## TypeScript and Casting

- Avoid unnecessary type casting using `as` or `as unknown as`.
- If casting is absolutely necessary (e.g., interfacing with external libraries or handling complex union types where type guards are insufficient), a comment MUST be included explaining why the cast is required.

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

## Build Systems, Avoid Copy-Paste

- Prefer shared helpers, utilities, and centralized mappings over duplicating the same logic in multiple files.
- When you notice repeated conditionals/branches (for example, repeated activity-type checks), extract a single source of truth and reuse it.
- For behavior that must stay consistent across game logic and UI, define that behavior once in a common module and import it where needed.
- During edits, if introducing similar code for a second time, pause and refactor to a reusable abstraction unless the user explicitly wants a one-off duplication.
