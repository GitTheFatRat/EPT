# CODE_STYLE_GUIDE.md — Engineering Standards for EPT

Zero fluff, zero over-engineering, production-ready code only.

---

## Core Principles

1. **KISS.** No premature abstraction. Do not build generic wrapper classes, plugin systems, or factory patterns unless the current milestone explicitly requires more than one implementation.
2. **YAGNI.** Build only what the current task needs. Do not add configuration options, feature flags, or extensibility hooks for hypothetical future requirements.
3. **Explicit over implicit.** Explicit types, explicit imports, explicit return values. No magic.
4. **Zero boilerplate bloat.** No unused variables, no dead code, no `// TODO` comments left in committed code (the one documented exception is the band-conversion-table placeholder described in `DATABASE_SCHEMA.md`).

---

## Backend (Node.js / Express / JavaScript — no TypeScript)

### Layering — enforce strictly
```
routes/       → defines paths + HTTP methods, wires middleware, calls controller
controllers/  → parses/validates request, calls service, formats response — no business logic here
services/     → all business logic (scoring, timer validation, band conversion, JSONB shaping)
security/     → password hashing, JWT sign/verify, and any future auth-strengthening logic (2FA, OAuth)
db/           → Supabase client calls only — no business logic here either
```
A controller must never talk to the database directly; it always goes through a service. A service must never call `bcrypt`/`jsonwebtoken` directly; it always goes through `security/` (e.g. `security/password.ts` exports `hashPassword`/`verifyPassword`, `security/token.ts` exports `signAccessToken`/`verifyAccessToken`/`signRefreshToken`). This keeps every future auth-algorithm change confined to one folder.

### Async & Error Handling
- Every route handler is `async` and wrapped so thrown errors reach a central `errorHandler` middleware — do not `try/catch` + manually format errors in every controller individually. Use a small `asyncHandler` wrapper utility instead.
- Errors thrown from services should use a small custom error class (e.g. `class AppError extends Error { constructor(statusCode, code, message) { ... } }`) so the error handler can map them to the response shape in `API_CONTRACT.md` without guessing.
- Use JSDoc comments (`/** @param {string} attemptId */`) on exported service functions to document expected argument shapes — this is documentation only, not enforced at compile time, but keeps intent clear since there is no compiler to catch mismatches.

### Example — good service function
```javascript
// services/attempt.service.js

/**
 * @param {string} attemptId
 * @param {string} userId
 * @param {Array<{questionId: string, userAnswer: any}>} answers
 * @returns {Promise<object>} ExamResult shape per API_CONTRACT.md
 */
export async function submitAttempt(attemptId, userId, answers) {
  const attempt = await getAttemptOrThrow(attemptId, userId);
  const questions = await getQuestionsForAttempt(attempt);
  const mergedAnswers = mergeWithDraftAnswers(attemptId, answers);
  const { correctCount, wrongCount, skippedCount, detailAnswers } = scoreAnswers(questions, mergedAnswers);
  const bandScore = convertToBand(attempt.skill, correctCount, questions.length);

  return persistResult(attempt, {
    correctCount,
    wrongCount,
    skippedCount,
    totalQuestions: questions.length,
    bandScore,
    detailAnswers,
  });
}
```

### Validation
- Use a schema validation library (`zod` recommended — it works fine in plain JavaScript without TypeScript, since validation happens at runtime) for every request body/query — reject early with `400` before touching the database. Validators live in `validators/`, imported into route definitions, not scattered inline in controllers.

### Security
- Never return `password_hash` in any API response, ever — exclude it at the query level or the DTO-mapping level, not just by "remembering not to."
- JWT secret and Supabase service role key come from environment variables only, loaded through a single `config/` module — never `process.env.X` scattered across the codebase.

---

## Frontend (React / Vite / JavaScript — no TypeScript / Redux Toolkit)

### Component Structure Order
1. Imports (React → third-party libraries → local components → utilities)
2. Component function
3. Hooks & local state
4. Handlers
5. JSX return

```jsx
// GOOD
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { QuestionRenderer } from './QuestionRenderer';
import { formatTime } from '@/lib/formatTime';

export function AttemptPanel({ questions, attemptId }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  const handleAnswerChange = (questionId, answer) => {
    dispatch(autosaveAnswer({ attemptId, questionId, answer }));
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <QuestionRenderer key={q.id} question={q} onChange={handleAnswerChange} />
      ))}
    </div>
  );
}
```

### State Management Rules
- Redux Toolkit slices own: auth session, active attempt state (current answers, timer sync point), exam list cache.
- Local `useState` is fine for pure UI state (modal open/closed, active tab) — do not put this in Redux.
- Never mix a local `setInterval` timer with Redux state updates every second (causes re-render storms). Compute remaining time from `expiresAt` on each render tick using `requestAnimationFrame` or a single `setInterval` at 1s that only updates a local display string, not global state.

### No TypeScript — shape discipline still applies
- No compiler is checking shapes, so discipline here is manual — this makes it more important, not less, to follow `DATABASE_SCHEMA.md`'s JSONB shapes exactly for every `question.content` object, and to use JSDoc `@param`/`@returns` comments on non-trivial functions so the shape is documented even without a type checker.
- Use PropTypes (`prop-types` package) on any component that isn't trivially simple, especially `QuestionRenderer` and its per-type sub-components, so a wrong shape fails loudly in the console during development instead of silently rendering `undefined`.

### QuestionRenderer Pattern
`QuestionRenderer` must dispatch to one sub-component per `question_type` (Strategy Pattern) — do not build one giant component with a long `if/else` chain handling every type's markup inline. One file per type under `features/attempt/components/questionTypes/`.

---

## Naming Conventions

| Item | Convention |
|---|---|
| React components | PascalCase (`ExamTimer.jsx`) |
| Hooks | camelCase, `use` prefix (`useAttemptTimer.js`) |
| Redux slices | camelCase, `*Slice.js` (`attemptSlice.js`) |
| Backend files | camelCase, role suffix (`attempt.service.js`, `attempt.controller.js`, `attempt.routes.js`) |
| DB columns | snake_case (matches Postgres convention in `DATABASE_SCHEMA.md`) |
| API JSON fields | camelCase (backend maps snake_case DB → camelCase DTO at the service/controller boundary) |

**Important:** the database uses `snake_case` and the API contract uses `camelCase` — mapping between them happens once, at the service layer, via a small mapper function. Do not let `snake_case` leak into API responses or `camelCase` leak into raw SQL/Supabase queries.