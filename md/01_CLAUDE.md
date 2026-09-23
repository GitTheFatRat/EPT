# CLAUDE.md — Project Context & Agent Entry Point

This repository contains **EPT (English Practice & Testing)** — a free IELTS practice platform for **Reading** and **Listening**, including standalone practice and a combined **Full Test (Overall)**: 3 Reading passages + 4 Listening passages/sections.

## Read order

1. **`01_CLAUDE.md`** (this file) — product summary, tech stack, folder structure, non-negotiable rules
2. **`02_DATABASE_SCHEMA.md`** — every table, column, JSONB shape. Authoritative — do not deviate.
3. **`03_API_CONTRACT.md`** — every endpoint, request/response shape. Authoritative — do not deviate.
4. **`04_CODE_STYLE_GUIDE.md`** — layering, naming, patterns.

Visual design (colors, spacing, typography) is being built separately in Figma by the project owner. **Do not invent design-system decisions.** Build with neutral Tailwind utilities that are easy to restyle later. This file instead defines the **behavior and state** every screen must support — that part is not optional and is not covered by Figma.

---

## 🎯 Product Summary

- Users register/login, practice Reading or Listening individually, or take a Full Test combining both.
- **Practice mode timers:** Reading = 20 minutes, Listening = 15 minutes.
- **Full Test timers:** Reading = 60 minutes (3 passages), Listening = 40 minutes (4 passages) — run **sequentially**, not simultaneously, each with its own timer. (Backend models this as a single row in `exam_attempts` with `current_segment`, `reading_expires_at`, and `listening_expires_at` columns).
- Timers are **server-authoritative**. The client displays a countdown derived from `expiresAt`; it never computes or trusts its own end time independently.
- Question content is flexible (JSONB) to support many IELTS question types — see `02_DATABASE_SCHEMA.md` for exact shapes. Never invent a new shape ad hoc.
- Auto-scoring on submit, with **immediate detailed review**: after submitting, the user sees every question with their answer, the correct answer, correct/incorrect flag, and explanation — right away, not on a separate later visit. See "Screen 2" below.

---

## 🛠 Tech Stack (fixed)

| Layer | Choice |
|---|---|
| Frontend | React (Vite), TypeScript strict, Redux Toolkit, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express, bcrypt, jsonwebtoken |
| Database | Supabase (PostgreSQL) |
| File storage | Supabase Storage (listening audio) |

---

## 📂 Repository Structure

Structure is designed so that **future cross-cutting logic** (stronger encryption/hashing, 2FA, OAuth login, rate limiting, RBAC, audit logging) has one obvious place to go, instead of being scattered later.

```
ept/
├── backend/
│   └── src/
│       ├── config/            # env loader, constants (durations, JWT settings) — single source, no scattered process.env
│       ├── db/                # Supabase client init, raw query helpers — no business logic
│       ├── middlewares/       # auth.middleware.ts, roleGuard.middleware.ts, errorHandler.ts
│       │                      # future: rateLimiter.middleware.ts, auditLog.middleware.ts plug in here
│       ├── security/          # NEW: password hashing, token signing/verification, future 2FA/OAuth logic
│       │                      # isolates all crypto/auth-algorithm logic so it can be upgraded without touching services/
│       ├── validators/        # request schema validation (zod), one file per resource
│       ├── services/          # ALL business logic: scoring, band conversion, timer validation, attempt lifecycle
│       ├── controllers/       # thin — parse request, call service, format response
│       ├── routes/            # Express routers, one file per resource
│       └── server.ts          # app entry
│
├── frontend/
│   └── src/
│       ├── app/                # store.ts (Redux), router.tsx
│       ├── features/
│       │   ├── auth/           # login, register, session slice
│       │   ├── exam/           # exam list/detail
│       │   ├── attempt/        # exam-taking screen — see "Screen 1" state contract below
│       │   │   └── components/
│       │   │       └── questionTypes/   # one component per question_type (Strategy Pattern)
│       │   ├── result/         # result + review screen — see "Screen 2" state contract below
│       │   └── profile/
│       ├── components/ui/      # dumb shared components, Tailwind only, no business logic
│       ├── lib/                # axiosClient.ts, bandConverter.ts, timeFormat.ts
│       └── types/               # TS types mirroring 02_DATABASE_SCHEMA.md and 03_API_CONTRACT.md
│
└── docs/                        # this folder
```

**Rule:** all password hashing, token generation/verification, and any future auth-strengthening logic (2FA, OAuth, session revocation) lives in `backend/src/security/`. Services and controllers call into it but never implement crypto/token logic inline. This is the one place to touch when auth requirements change later.

---

## 🖥️ Screen 1 — Exam-Taking Screen: Required State Contract

No layout is specified here (Figma will define that). What **must** exist regardless of layout:

### Required state (Redux `attemptSlice`)
```typescript
interface AttemptState {
  attemptId: string;
  mode: 'practice_reading' | 'practice_listening' | 'full_test';
  currentSegment: 'reading' | 'listening';   // relevant only for full_test
  expiresAt: string;                          // ISO timestamp from server — never computed locally
  passages: PassageWithQuestions[];
  answers: Record<string /* questionId */, unknown /* shape per question type */>;
  answerStatus: Record<string /* questionId */, 'unanswered' | 'answered' | 'flagged'>;
  activeQuestionId: string | null;
  audioPlaybackState: {
    hasPlayed: boolean;          // full_test / real-exam behavior: audio plays once only
    allowReplay: boolean;        // true only in standalone practice mode, false in full_test
    currentTimeSeconds: number;
  };
  submissionState: 'idle' | 'submitting' | 'submitted' | 'expired';
}
```

### Required behaviors
1. **Timer**: a single `setInterval` (1s) computes `remaining = expiresAt - now()` for display only. On reaching 0, auto-trigger submit exactly once (guard against double-submit).
2. **Autosave**: every answer change dispatches a debounced (≈2s) `PATCH /attempts/:id/autosave` call. Must not block the UI or the user typing.
3. **Question navigator data**: regardless of how Figma visualizes it, the app must be able to answer "what is the status of question N?" (`unanswered` / `answered` / `flagged`) at all times from `answerStatus`, and jump `activeQuestionId` to any question.
4. **Audio behavior**: in `full_test` mode and in "exam simulation" practice, audio plays once (`allowReplay: false`); no seeking backward/forward, matching real IELTS conditions. Only a dedicated "unlimited practice" mode (if introduced later) would set `allowReplay: true`. Default assumption: **`allowReplay: false` everywhere** unless a future requirement says otherwise — do not build a scrubber/seek bar by default.
5. **Resume on reload**: on mount, call `GET /attempts/:id` and hydrate this entire state from the server response (`expiresAt`, `savedAnswers`, `currentSegment`) — never resume from `localStorage` as the source of truth (autosave to the server is what protects the user, not client storage).
6. **Full Test segment transition**: when the Reading segment's timer hits 0 or the user submits early, call `POST /attempts/:id/advance-segment`, replace `passages`/`expiresAt`/`currentSegment` with the Listening segment's data, and reset `answers`/`answerStatus` for the new segment. Do not let Reading answers leak into the Listening segment's state.

---

## 🖥️ Screen 2 — Result & Review Screen: Required State Contract

Confirmed behavior: **immediate detailed review after submission** — not deferred to a separate later visit.

### Required state (Redux `resultSlice` or local query state)
```typescript
interface ResultState {
  resultId: string;
  skill: 'reading' | 'listening' | 'overall';
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  totalQuestions: number;
  bandScore: number | null;
  detailAnswers: {
    questionId: string;
    questionNumber: number;
    userAnswer: unknown;
    correctAnswer: unknown;
    isCorrect: boolean;
    explanation: string;
  }[];
}
```

### Required behaviors
1. On `submit` success, the frontend must **navigate straight to the review screen** using the `submit` response's `resultId` — do not require a second fetch or a redirect through a summary-only page first.
2. Review screen must be able to render, per question: the user's own answer, the correct answer, a correct/incorrect indicator, and the explanation text — the data for all of this comes from `detailAnswers` in one shot (`GET /api/results/:id`), no N+1 fetching per question.
3. For `full_test`, after both segments are submitted, produce **one combined "overall" result view** (`skill: 'overall'`) in addition to (or aggregating) the two individual segment results — do not force the user to open two separate result pages to see their Full Test outcome. Decide and document here once implemented whether "overall" is a third `exam_results` row or a computed aggregation of the two segment rows; do not leave this ambiguous in code.
4. Band score display must handle `null` gracefully (e.g. conversion table not yet configured) — never show a fabricated number.

---

## 📐 Non-Negotiable Rules

1. **Server-authoritative timing** — see `expiresAt` handling above and duration table in `02_DATABASE_SCHEMA.md`.
2. **Never leak correct answers before submission.** Any pre-submission response must strip `correctAnswer(s)`/`explanation` from question `content`.
3. **JSONB question content follows `02_DATABASE_SCHEMA.md` shapes exactly.** New question type → update that file first.
4. **API must match `03_API_CONTRACT.md` exactly.** Contract change → update that file in the same commit.
5. **No placeholder code** (`// TODO`, stub functions) — except the one documented exception for the band-conversion table in `02_DATABASE_SCHEMA.md`.
6. **Autosave is mandatory** on the exam-taking screen (see Screen 1 contract).
7. **Full Test is sequential**, independent timers per segment — never shared/averaged.
8. **All hashing/token/future-auth logic lives in `backend/src/security/`** — never inline in controllers or services.
9. **No visual design decisions** beyond neutral Tailwind utilities — layout/spacing/color comes from Figma handoff later.
