# API_CONTRACT.md — Backend API Source of Truth

**This file is authoritative.** All endpoints, methods, request bodies, and response shapes must match exactly what's documented here. If an endpoint needs to change, update this file in the same commit as the code change — never let code and this document drift apart.

Base URL (dev): `http://localhost:{PORT}/api`

All authenticated endpoints require header: `Authorization: Bearer <access_token>`

All error responses use this shape:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Human-readable message"
  }
}
```

All success responses wrap data as:
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 1. Auth — `/api/auth`

### `POST /api/auth/register`
```json
// Request
{ "username": "string", "fullName": "string", "email": "string", "password": "string" }
// Response 201
{ "success": true, "data": { "user": { "id": "uuid", "username": "...", "email": "..." } } }
```
- Hash password with bcrypt (cost factor ≥ 10) before storing.
- Validate: username 3–50 chars alphanumeric/underscore, email format, password ≥ 8 chars.

### `POST /api/auth/login`
```json
// Request
{ "email": "string", "password": "string" }
// Response 200
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "user": { "id": "uuid", "username": "...", "email": "...", "fullName": "...", "role": "student" }
  }
}
```

### `POST /api/auth/refresh`
```json
// Request
{ "refreshToken": "string" }
// Response 200
{ "success": true, "data": { "accessToken": "jwt..." } }
```

### `POST /api/auth/logout`
```json
// Request
{ "refreshToken": "string" }
// Response 200
{ "success": true, "data": null }
```
- Must invalidate/blacklist the refresh token server-side.

### `GET /api/auth/me` (auth required)
```json
// Response 200
{ "success": true, "data": { "id": "uuid", "username": "...", "email": "...", "role": "...", "fullName": "string", "avatarUrl": null, "bannerUrl": null, "description": null, "targetBand": null, "studyType": null } }
```

---

## 2. Users — `/api/users`

### `PATCH /api/users/me` (auth required)
```json
// Request (all fields optional)
{
  "fullName": "string", "avatarUrl": "string",
  "bannerUrl": "string",
  "description": "string",
  "targetBand": 7.0,
  "studyType": "academic"
}
// Response 200
{ "success": true, "data": { /* updated user object, same shape as GET /auth/me */ } }
```

---

## 3. Exams — `/api/exams`

### `GET /api/exams` (public)
Query params: `?page=1&limit=20&published=true`
```json
// Response 200
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "title": "Cambridge 19 Test 1", "code": "CAMBRIDGE-19-TEST01", "description": "...", "isPublished": true }
    ],
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

### `GET /api/exams/:code` (public)
Returns exam + all passages + all questions **with answer fields stripped**.
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "code": "...",
    "passages": [
      {
        "id": "uuid",
        "skill": "reading",
        "orderIndex": 1,
        "title": "...",
        "passageText": "...",
        "audioUrl": null,
        "questions": [
          {
            "id": "uuid",
            "questionNumber": 1,
            "type": "multiple_choice",
            "groupInstruction": "...",
            "content": { "question": "...", "options": [ { "key": "A", "text": "..." } ] }
            // NOTE: no correct_answer / correct_answers / explanation keys present
          }
        ]
      }
    ]
  }
}
```

### `POST /api/exams` (auth required, role=admin)
```json
// Request
{ "title": "string", "code": "STRING-UPPERCASE", "description": "string" }
// Response 201
{ "success": true, "data": { "id": "uuid", "title": "...", "code": "...", "isPublished": false } }
```
- `code` must be validated uppercase server-side regardless of what's sent; reject with `400 INVALID_CODE_FORMAT` if it contains lowercase letters or invalid characters, rather than silently uppercasing it — the admin should see and fix the input.

### `PATCH /api/exams/:id` (auth required, role=admin)
```json
// Request (any subset)
{ "title": "string", "description": "string", "isPublished": true }
// Response 200
{ "success": true, "data": { /* updated exam */ } }
```

### `DELETE /api/exams/:id` (auth required, role=admin)
```json
// Response 200
{ "success": true, "data": null }
```

### `POST /api/exams/:id/passages` (auth required, role=admin)
```json
// Request (multipart/form-data if audio file included, else JSON)
{
  "skill": "reading" | "listening",
  "orderIndex": 1,
  "title": "string",
  "passageText": "string (reading only)",
  "audioFile": "binary (listening only, uploaded to Supabase Storage server-side)",
  "imageUrl": "string (optional)"
}
// Response 201
{ "success": true, "data": { "id": "uuid", "skill": "...", "orderIndex": 1, "audioUrl": "https://..." } }
```

### `POST /api/passages/:id/questions` (auth required, role=admin)
Bulk insert.
```json
// Request
{
  "questions": [
    {
      "orderIndex": 1,
      "questionNumber": 1,
      "type": "multiple_choice",
      "groupInstruction": "string",
      "content": { /* shape per DATABASE_SCHEMA.md, including correct_answer */ },
      "points": 1
    }
  ]
}
// Response 201
{ "success": true, "data": { "insertedCount": 10 } }
```

---

## 4. Attempts — `/api/attempts`

### `POST /api/attempts/start` (auth required)
```json
// Request
{ "examId": "uuid", "mode": "practice_reading" | "practice_listening" | "full_test" }
// Response 201
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "mode": "full_test",
    "startedAt": "2026-09-22T10:00:00.000Z",
    "expiresAt": "2026-09-22T11:00:00.000Z",
    "currentSegment": "reading",
    "passages": [ /* same shape as GET /api/exams/:code, answers stripped */ ]
  }
}
```
- Server computes `expiresAt` from the fixed duration table in `DATABASE_SCHEMA.md` — never accept a client-supplied duration.
- For `full_test`, only the current segment's passages are returned; call this endpoint again (or a segment-advance endpoint — see below) to fetch the next segment once the first is submitted.

### `POST /api/attempts/:id/advance-segment` (auth required, full_test only)
Called when the Reading segment of a Full Test is submitted, to start the Listening segment's timer and fetch its passages.
```json
// Response 200
{
  "success": true,
  "data": {
    "currentSegment": "listening",
    "expiresAt": "2026-09-22T11:40:00.000Z",
    "passages": [ /* listening passages, answers stripped */ ]
  }
}
```

### `PATCH /api/attempts/:id/autosave` (auth required)
```json
// Request
{ "questionId": "uuid", "userAnswer": "B" }
// userAnswer shape varies by question type — see DATABASE_SCHEMA.md content shapes
// Response 200
{ "success": true, "data": null }
```
- Should be safe to call frequently (idempotent upsert on `(attempt_id, question_id)`).

### `POST /api/attempts/:id/submit` (auth required)
```json
// Request
{ "answers": [ { "questionId": "uuid", "userAnswer": "B" } ] }
// Response 200
{
  "success": true,
  "data": {
    "resultId": "uuid",
    "skill": "reading",
    "correctCount": 32,
    "wrongCount": 6,
    "skippedCount": 2,
    "totalQuestions": 40,
    "bandScore": 7.0
  }
}
```
- Server must validate `now() <= expires_at (+ small grace period, e.g. 5s)`. If already expired, still accept the submission using whatever was last autosaved, mark `status='expired'` instead of `'submitted'`, and score normally — do not reject the request outright, since the user's work should not be lost.
- Any `answers` array entries are merged with the autosaved drafts (client submission wins over stale draft for the same `questionId`).

### `GET /api/attempts/:id` (auth required)
Used to resume an in-progress attempt after page reload.
```json
// Response 200
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "status": "in_progress",
    "mode": "full_test",
    "currentSegment": "reading",
    "expiresAt": "2026-09-22T11:00:00.000Z",
    "passages": [ /* current segment, answers stripped */ ],
    "savedAnswers": [ { "questionId": "uuid", "userAnswer": "B" } ]
  }
}
```

---

## 5. Results — `/api/results`

### `GET /api/results` (auth required)
Query params: `?page=1&limit=20`
```json
// Response 200
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "examTitle": "...", "skill": "overall", "bandScore": 6.5, "createdAt": "..." }
    ],
    "page": 1, "limit": 20, "total": 12
  }
}
```

### `GET /api/results/:id` (auth required, owner or admin only)
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "examTitle": "...",
    "skill": "reading",
    "correctCount": 32,
    "wrongCount": 6,
    "skippedCount": 2,
    "totalQuestions": 40,
    "bandScore": 7.0,
    "detailAnswers": [
      {
        "questionId": "uuid",
        "questionNumber": 1,
        "userAnswer": "B",
        "correctAnswer": "B",
        "isCorrect": true,
        "explanation": "..."
      }
    ]
  }
}
```

### `GET /api/results/stats` (auth required)
```json
// Response 200
{
  "success": true,
  "data": {
    "averageBand": 6.5,
    "totalAttempts": 12,
    "history": [
      { "date": "2026-09-01", "skill": "reading", "bandScore": 6.0 },
      { "date": "2026-09-15", "skill": "reading", "bandScore": 6.5 }
    ]
  }
}
```

---

## Auth Middleware Behavior (applies to every protected route above)

- Missing/invalid token → `401` with `code: "UNAUTHORIZED"`.
- Valid token but wrong role for an admin route → `403` with `code: "FORBIDDEN"`.
- Expired access token → `401` with `code: "TOKEN_EXPIRED"` (frontend axios interceptor should catch this specific code and attempt `/api/auth/refresh` once before failing).

