# CODE_STYLE_GUIDE.md — Engineering Standards for EPT

Zero fluff, zero over-engineering, production-ready code only.

---

## Core Principles

1. **KISS.** No premature abstraction. Do not build generic wrapper classes, plugin systems, or factory patterns unless the current milestone explicitly requires more than one implementation.
2. **YAGNI.** Build only what the current task needs. Do not add configuration options, feature flags, or extensibility hooks for hypothetical future requirements.
3. **Explicit over implicit.** Explicit types, explicit imports, explicit return values. No magic.
4. **Zero boilerplate bloat.** No unused variables, no dead code, no `// TODO` comments left in committed code (the one documented exception is the band-conversion-table placeholder described in `DATABASE_SCHEMA.md`).

---

## Backend (Node.js / Express / TypeScript)

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
- Errors thrown from services should be typed/classed (e.g. `class AppError extends Error { statusCode: number; code: string }`) so the error handler can map them to the response shape in `API_CONTRACT.md` without guessing.

### Example — good service function
```typescript
// services/attempt.service.ts
export async function submitAttempt(
  attemptId: string,
  userId: string,
  answers: SubmitAnswerDTO[]
): Promise<ExamResultDTO> {
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
- Use a schema validation library (`zod` recommended) for every request body/query — reject early with `400` before touching the database. Validators live in `validators/`, imported into route definitions, not scattered inline in controllers.

### Security
- Never return `password_hash` in any API response, ever — exclude it at the query level or the DTO-mapping level, not just by "remembering not to."
- JWT secret and Supabase service role key come from environment variables only, loaded through a single `config/` module — never `process.env.X` scattered across the codebase.

---

## Frontend (React / Vite / TypeScript / Redux Toolkit)

### Component Structure Order
1. Imports (React → third-party libraries → local components → types → utilities)
2. Type/interface definitions (exported alongside the component)
3. Component function
4. Hooks & local state
5. Handlers
6. JSX return

```tsx
// GOOD
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionRenderer } from './QuestionRenderer';
import type { Question } from '@/types/exam';
import { formatTime } from '@/lib/formatTime';

interface AttemptPanelProps {
  questions: Question[];
  attemptId: string;
}

export function AttemptPanel({ questions, attemptId }: AttemptPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  const handleAnswerChange = (questionId: string, answer: unknown) => {
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

### TypeScript
- No `any`. If a shape is genuinely dynamic (e.g. JSONB `content`), model it as a discriminated union keyed by `type`, matching the shapes in `DATABASE_SCHEMA.md` exactly:
```typescript
type QuestionContent =
  | { type: 'multiple_choice'; question: string; options: { key: string; text: string }[] }
  | { type: 'true_false_not_given'; statement: string }
  | { type: 'sentence_completion'; textTemplate: string; wordLimit: string; blanks: { blankId: number }[] }
  // ...etc, mirrored from DATABASE_SCHEMA.md (answer fields omitted client-side pre-submission)
```

### QuestionRenderer Pattern
`QuestionRenderer` must dispatch to one sub-component per `question_type` (Strategy Pattern) — do not build one giant component with a long `if/else` chain handling every type's markup inline. One file per type under `features/attempt/components/questionTypes/`.

---

## Naming Conventions

| Item | Convention |
|---|---|
| React components | PascalCase (`ExamTimer.tsx`) |
| Hooks | camelCase, `use` prefix (`useAttemptTimer.ts`) |
| Redux slices | camelCase, `*Slice.ts` (`attemptSlice.ts`) |
| Backend files | camelCase, role suffix (`attempt.service.ts`, `attempt.controller.ts`, `attempt.routes.ts`) |
| DB columns | snake_case (matches Postgres convention in `DATABASE_SCHEMA.md`) |
| API JSON fields | camelCase (backend maps snake_case DB → camelCase DTO at the service/controller boundary) |

**Important:** the database uses `snake_case` and the API contract uses `camelCase` — mapping between them happens once, at the service layer, via a small mapper function. Do not let `snake_case` leak into API responses or `camelCase` leak into raw SQL/Supabase queries.
