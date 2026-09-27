# DATABASE_SCHEMA.md — Source of Truth for the Supabase/PostgreSQL Schema

**This file is authoritative.** Do not create, rename, or drop tables/columns without updating this file in the same change. If a task seems to require a schema change not described here, stop and add the change here first, then implement it.

---

## Entity Overview

```
users < exam_attempts > exams < exam_passages > passages < questions
  │                                                    │
  ├──< exam_results >─────────────────────────────────┘
  │           │
  ├──< refresh_tokens
  │
  exam_attempts ──< attempt_answers_draft >── questions
```

---

## 1. `users`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | `gen_random_uuid()` |
| username | varchar(50) | unique, not null |
| email | varchar(255) | unique, not null |
  | full_name | varchar(255) | nullable |
| password_hash | text | not null — bcrypt hash, never store plaintext |
| role | varchar(20) | `'student'` \| `'admin'`, default `'student'` |
| avatar_url | text | nullable |
| banner_url | text | nullable |
| description | text | nullable — bio/about |
| target_band | numeric(2,1) | nullable — e.g. 7.0, 6.5 |
| study_type | varchar(30) | e.g. `'academic'`, `'general_training'` |
| created_at | timestamptz | default `now()` |
| updated_at | timestamptz | default `now()`, update on profile edit |

---

## 2. `exams`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| title | varchar(255) | e.g. `"Cambridge 19 Test 1"` |
| code | varchar(50) | **unique, uppercase** — e.g. `"CAMBRIDGE-19-TEST01"`. Enforce uppercase both client-side (input transform) and server-side (validator + DB check constraint) |
| description | text | nullable |
| is_published | boolean | default `false` — unpublished exams are not returned by public list endpoints |
| created_by | uuid | FK → `users.id`, nullable |
| created_at / updated_at | timestamptz | |

```sql
alter table exams add constraint code_is_uppercase check (code = upper(code));
```

---

## 3. `passages`

One row per passage (Reading) or per section/audio (Listening).

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| skill | enum `skill_type` | `'reading'` \| `'listening'` |
| title | varchar(255) | e.g. "Passage 1: The History of Tea" |
| passage_text | text | reading only — full passage content (HTML or Markdown, FE decides render) |
| audio_url | text | listening only — Supabase Storage public/signed URL |
| audio_duration_seconds | int | listening only |
| image_url | text | optional — diagrams/maps for labeling questions |

```sql
create type skill_type as enum ('reading', 'listening');
```

---

## 4. `exam_passages` (Junction Table)

Handles the many-to-many relationship between `exams` and `passages`, avoiding data duplication when a single passage is used in both individual practice exams and a combined Mock Test. A Reading exam typically links 3 passages; a Listening exam typically links 4 passages (enforced at the application layer).

| Column | Type | Notes |
|---|---|---|
| exam_id | uuid, PK | FK -> `exams.id`, `on delete cascade` |
| passage_id | uuid, PK | FK -> `passages.id`, `on delete cascade` |
| order_index | int | 1—3 for reading, 1—4 for listening. Must be unique per exam. |

```sql
alter table exam_passages add constraint unique_exam_order unique(exam_id, order_index);
alter table exam_passages enable row level security;
create policy "Allow public read access on exam_passages" on exam_passages for select using (true);
```

---

## 5. `questions`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| passage_id | uuid | FK → `passages.id`, `on delete cascade` |
| order_index | int | order within the passage |
| question_number | int | **global** display number across the whole exam section (Q1–Q40) |
| type | enum `question_type` | see list below |
| group_instruction | text | nullable — e.g. `"Questions 1–5: Choose the correct letter A, B, C or D"` |
| content | jsonb | not null — shape depends on `type`, see below |
| points | int | default `1` |
| created_at | timestamptz | |

```sql
alter table questions add constraint unique_question_number unique(passage_id, question_number);
```

### `question_type` enum values

```sql
create type question_type as enum (
  'multiple_choice',
  'true_false_not_given',
  'yes_no_not_given',
  'matching_headings',
  'matching_information',
  'matching_features',
  'sentence_completion',
  'summary_completion',
  'note_completion',
  'table_completion',
  'form_completion',
  'diagram_label_completion',
  'short_answer'
);
```

### `content` JSONB shapes (per type) — follow exactly

**`multiple_choice`**
```json
{
  "question": "What does the author suggest about...?",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." }
  ],
  "correct_answer": "B",
  "explanation": "..."
}
```

**`true_false_not_given` / `yes_no_not_given`**
```json
{
  "statement": "The author believes climate change is irreversible.",
  "correct_answer": "TRUE",
  "explanation": "..."
}
```

**`matching_headings`**
```json
{
  "headings": [
    { "key": "i", "text": "A surprising discovery" },
    { "key": "ii", "text": "The economic impact" }
  ],
  "items": [
    { "paragraph": "A", "correct_answer": "iii" },
    { "paragraph": "B", "correct_answer": "i" }
  ]
}
```

**`matching_information` / `matching_features`**
```json
{
  "prompt": "Which paragraph contains the following information?",
  "options": [{ "key": "A", "text": "Paragraph A description" }],
  "items": [
    { "statement": "A reference to an earlier study", "correct_answer": "C" }
  ]
}
```

**`sentence_completion` / `summary_completion` / `note_completion` / `table_completion` / `form_completion`**
```json
{
  "text_template": "The company was founded in {{1}} and later moved to {{2}}.",
  "word_limit": "NO MORE THAN TWO WORDS",
  "blanks": [
    { "blank_id": 1, "correct_answers": ["1998", "nineteen ninety-eight"] },
    { "blank_id": 2, "correct_answers": ["London"] }
  ]
}
```
> `correct_answers` is an array to allow accepted alternate spellings/synonyms. Scoring service must check case-insensitive match against any element in the array.

**`diagram_label_completion`**
```json
{
  "image_url": "https://.../diagram.png",
  "labels": [
    { "label_id": "A", "correct_answers": ["engine"] },
    { "label_id": "B", "correct_answers": ["exhaust", "exhaust pipe"] }
  ]
}
```

**`short_answer`**
```json
{
  "question": "What material is used for the roof?",
  "word_limit": "NO MORE THAN THREE WORDS AND/OR A NUMBER",
  "correct_answers": ["thatch", "thatched straw"]
}
```

**Critical rule:** any API response sent to the client **before** an attempt is submitted must strip `correct_answer`, `correct_answers`, and `explanation` fields from `content` recursively. Only after submission (result review) may these fields be included.

---

## 6. `exam_attempts`

One row per exam-taking session.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid | FK → `users.id`, `on delete cascade` |
| exam_id | uuid | FK → `exams.id`, `on delete cascade` |
| mode | enum `attempt_mode` | `'practice_reading'` \| `'practice_listening'` \| `'full_test'` |
| status | enum `attempt_status` | `'in_progress'` \| `'submitted'` \| `'expired'` \| `'abandoned'` |
| started_at | timestamptz | default `now()` |
| expires_at | timestamptz | **not null** — computed server-side at creation. Represents the CURRENT segment's expiry |
| current_segment | varchar(20) | nullable — `'reading'` \| `'listening'` (used for full_test) |
| reading_expires_at | timestamptz | nullable — expiry for reading segment in full_test |
| listening_expires_at | timestamptz | nullable — expiry for listening segment in full_test |
| submitted_at | timestamptz | nullable |
| time_spent_seconds | int | nullable, computed on submit |
| created_at | timestamptz | |

```sql
create type attempt_mode as enum ('practice_reading', 'practice_listening', 'full_test');
create type attempt_status as enum ('in_progress', 'submitted', 'expired', 'abandoned');
```

### Duration rules (hardcode in a single constants module, reference from here)

| mode | skill segment | duration |
|---|---|---|
| `practice_reading` | reading | 20 minutes |
| `practice_listening` | listening | 15 minutes |
| `full_test` | reading segment | 60 minutes |
| `full_test` | listening segment | 40 minutes |

Full Test is **sequential**: reading and listening each get their own time windows; do not sum or share time budgets. **Backend modeling choice**: This is modeled as a single `exam_attempts` row with extra columns (`current_segment`, `reading_expires_at`, `listening_expires_at`). The `expires_at` column always holds the expiry of the *current* segment being played to simplify queries.

---

## 7. `attempt_answers_draft`

Autosave table — overwritten continuously during an attempt.

| Column | Type | Notes |
|---|---|---|
| attempt_id | uuid | FK → `exam_attempts.id`, `on delete cascade` |
| question_id | uuid | FK → `questions.id`, `on delete cascade` |
| user_answer | jsonb | shape mirrors the answer format for that question type (e.g. `"B"`, `["1998"]`, `{"A": "engine"}`) |
| updated_at | timestamptz | default `now()` |

```sql
alter table attempt_answers_draft add constraint pk_draft primary key (attempt_id, question_id);
```

---

## 8. `exam_results`

Final, immutable snapshot after scoring.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| attempt_id | uuid | FK → `exam_attempts.id`, `on delete cascade` |
| user_id | uuid | FK → `users.id`, `on delete cascade` |
| exam_id | uuid | FK → `exams.id`, `on delete cascade` |
| skill | varchar(20) | `'reading'` \| `'listening'` \| `'overall'` |
| correct_count | int | not null, default 0 |
| wrong_count | int | not null, default 0 |
| skipped_count | int | not null, default 0 |
| total_questions | int | not null |
| band_score | numeric(2,1) | nullable — see band conversion note below |
| detail_answers | jsonb | full snapshot: every question with user's answer, correct answer, and correct/incorrect flag — used to render the review screen without re-joining questions table |
| created_at | timestamptz | |

### Band score conversion — **placeholder, needs real data**

Reading and Listening use different raw-score-to-band tables (per official Cambridge/IDP tables). **Do not invent numbers.** Implement `bandConverter` as a pure function reading from a config file (`band-conversion-table.json`) with two arrays (`reading`, `listening`), each mapping `correct_count` (0–40) → `band`. Leave this config file with placeholder/approximate values clearly marked `// TODO: verify against official table` **only in this one file** — this is the sole exception to the "no placeholders" rule in `CLAUDE.md`, because correctness here depends on external reference data the agent cannot fabricate.

---

## 9. `refresh_tokens`

Stores hashed refresh tokens for revocation on logout. The backend hashes each issued refresh token (SHA-256) before persisting — the raw JWT is never stored.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | `gen_random_uuid()` |
| user_id | uuid | FK → `users.id`, `on delete cascade` |
| token_hash | text | not null, unique — SHA-256 hex digest of the raw refresh JWT |
| expires_at | timestamptz | not null — mirrors the JWT `exp` claim for DB-level cleanup |
| revoked_at | timestamptz | nullable — set on logout; non-null means token is invalidated |
| created_at | timestamptz | default `now()` |

---

## Indexes

```sql
create index idx_exam_passages_exam on exam_passages(exam_id);
create index idx_exam_passages_passage on exam_passages(passage_id);
create index idx_questions_passage on questions(passage_id);
create index idx_attempts_user on exam_attempts(user_id, status);
create index idx_results_user on exam_results(user_id, created_at desc);
create index idx_refresh_tokens_user on refresh_tokens(user_id);
```

## Row-Level Security (Supabase)

If using Supabase client directly from the frontend for any reads (not recommended for this project — prefer going through the Express backend for all writes and sensitive reads), enable RLS on every table and write policies so a user can only read their own `exam_attempts`, `attempt_answers_draft`, and `exam_results` rows. If the backend uses the Supabase **service role key** exclusively (recommended), RLS can stay permissive at the DB level since the Express layer is the actual authorization boundary — but document which approach is chosen here once decided.
