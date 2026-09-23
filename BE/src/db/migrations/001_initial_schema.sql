-- ============================================================
-- EPT — Initial Database Schema
-- Source of truth: 02_DATABASE_SCHEMA.md
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ────────────────────────────────────────────────────────────

CREATE TYPE skill_type AS ENUM ('reading', 'listening');

CREATE TYPE question_type AS ENUM (
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

CREATE TYPE attempt_mode AS ENUM (
  'practice_reading',
  'practice_listening',
  'full_test'
);

CREATE TYPE attempt_status AS ENUM (
  'in_progress',
  'submitted',
  'expired',
  'abandoned'
);

-- ────────────────────────────────────────────────────────────
-- 2. HELPER: auto-update updated_at on row modification
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- 3. TABLES
-- ────────────────────────────────────────────────────────────

-- 3.1 users
CREATE TABLE users (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  username        varchar(50)   NOT NULL UNIQUE,
  email           varchar(255)  NOT NULL UNIQUE,
  password_hash   text          NOT NULL,
  role            varchar(20)   NOT NULL DEFAULT 'student',
  avatar_url      text,
  banner_url      text,
  description     text,
  target_band     numeric(2,1),
  study_type      varchar(30),
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3.2 exams
CREATE TABLE exams (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title           varchar(255)  NOT NULL,
  code            varchar(50)   NOT NULL UNIQUE,
  description     text,
  is_published    boolean       NOT NULL DEFAULT false,
  created_by      uuid          REFERENCES users(id),
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE exams
  ADD CONSTRAINT code_is_uppercase CHECK (code = upper(code));

CREATE TRIGGER trg_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3.3 passages
CREATE TABLE passages (
  id                      uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id                 uuid          NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  skill                   skill_type    NOT NULL,
  order_index             int           NOT NULL,
  title                   varchar(255)  NOT NULL,
  passage_text            text,
  audio_url               text,
  audio_duration_seconds  int,
  image_url               text
);

ALTER TABLE passages
  ADD CONSTRAINT unique_order UNIQUE (exam_id, skill, order_index);

-- 3.4 questions
CREATE TABLE questions (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id        uuid          NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  order_index       int           NOT NULL,
  question_number   int           NOT NULL,
  type              question_type NOT NULL,
  group_instruction text,
  content           jsonb         NOT NULL,
  points            int           NOT NULL DEFAULT 1,
  created_at        timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE questions
  ADD CONSTRAINT unique_question_number UNIQUE (passage_id, question_number);

-- 3.5 exam_attempts
CREATE TABLE exam_attempts (
  id                  uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id             uuid            NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  mode                attempt_mode    NOT NULL,
  status              attempt_status  NOT NULL DEFAULT 'in_progress',
  started_at          timestamptz     NOT NULL DEFAULT now(),
  expires_at          timestamptz     NOT NULL,
  submitted_at        timestamptz,
  time_spent_seconds  int,
  created_at          timestamptz     NOT NULL DEFAULT now()
);

-- 3.6 attempt_answers_draft
CREATE TABLE attempt_answers_draft (
  attempt_id    uuid        NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id   uuid        NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer   jsonb,
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT pk_draft PRIMARY KEY (attempt_id, question_id)
);

-- 3.7 exam_results
CREATE TABLE exam_results (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      uuid          NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  user_id         uuid          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id         uuid          NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  skill           varchar(20)   NOT NULL,
  correct_count   int           NOT NULL DEFAULT 0,
  wrong_count     int           NOT NULL DEFAULT 0,
  skipped_count   int           NOT NULL DEFAULT 0,
  total_questions int           NOT NULL,
  band_score      numeric(2,1),
  detail_answers  jsonb,
  created_at      timestamptz   NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 4. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_passages_exam    ON passages(exam_id, skill);
CREATE INDEX idx_questions_passage ON questions(passage_id);
CREATE INDEX idx_attempts_user    ON exam_attempts(user_id, status);
CREATE INDEX idx_results_user     ON exam_results(user_id, created_at DESC);
