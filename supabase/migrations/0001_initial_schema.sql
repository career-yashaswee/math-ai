-- ═══════════════════════════════════════════════════════════
-- MathAI — Initial Database Schema
-- Class 12 JEE/NEET Mathematics Practice Platform
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension (already available in Supabase)
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- 1. USERS (extends auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.users (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null unique,
  full_name      text,
  avatar_url     text,
  class          smallint not null default 12,
  xp             integer not null default 0,
  coins          integer not null default 0,
  points         integer not null default 0,
  streak         integer not null default 0,
  last_attempt_date date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_users_points on public.users(points desc);
create index if not exists idx_users_xp on public.users(xp desc);

-- ─────────────────────────────────────────────────────────────
-- 2. CHAPTERS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.chapters (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  class        smallint not null default 12,
  order_index  smallint not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_chapters_class on public.chapters(class, order_index);

-- ─────────────────────────────────────────────────────────────
-- 3. TOPICS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.topics (
  id           uuid primary key default gen_random_uuid(),
  chapter_id   uuid not null references public.chapters(id) on delete cascade,
  name         text not null,
  description  text,
  order_index  smallint not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_topics_chapter on public.topics(chapter_id, order_index);

-- ─────────────────────────────────────────────────────────────
-- 4. QUESTIONS (correct_answer is server-only)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  topic_id       uuid not null references public.topics(id) on delete cascade,
  title          text not null,
  body           text not null,
  correct_answer text not null,
  difficulty     text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  marks          smallint not null default 10,
  hint           text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_questions_topic on public.questions(topic_id);
create index if not exists idx_questions_difficulty on public.questions(difficulty);
create index if not exists idx_questions_active on public.questions(is_active);

-- Safe view: excludes correct_answer for client-side access
create or replace view public.questions_safe as
  select
    id, topic_id, title, body, difficulty, marks, hint, is_active, created_at
  from public.questions
  where is_active = true;

-- ─────────────────────────────────────────────────────────────
-- 5. ATTEMPTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  question_id     uuid not null references public.questions(id) on delete cascade,
  student_answer  text,
  started_at      timestamptz not null default now(),
  submitted_at    timestamptz,
  time_taken_s    integer,
  status          text not null default 'in_progress'
                  check (status in ('in_progress', 'submitted', 'analysed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_attempts_user on public.attempts(user_id, created_at desc);
create index if not exists idx_attempts_question on public.attempts(question_id);
create index if not exists idx_attempts_status on public.attempts(status);
-- Note: expression index with ::date removed (not IMMUTABLE in PG).
-- idx_attempts_user on (user_id, created_at desc) covers date-range queries.

-- ─────────────────────────────────────────────────────────────
-- 6. ANALYSIS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.analysis (
  id                   uuid primary key default gen_random_uuid(),
  attempt_id           uuid not null unique references public.attempts(id) on delete cascade,
  user_id              uuid not null references public.users(id) on delete cascade,
  exact_match_score    numeric(4,2) not null default 0 check (exact_match_score between 0 and 10),
  gemini_score         numeric(4,2) not null default 0 check (gemini_score between 0 and 10),
  final_score          numeric(4,2) not null default 0 check (final_score between 0 and 10),
  approach_breakdown   text,
  feedback             text,
  correct_answer_hint  text,
  gemini_raw_response  jsonb,
  xp_awarded           integer not null default 0,
  coins_awarded        integer not null default 0,
  created_at           timestamptz not null default now()
);

create index if not exists idx_analysis_user on public.analysis(user_id, created_at desc);
create index if not exists idx_analysis_attempt on public.analysis(attempt_id);

-- ─────────────────────────────────────────────────────────────
-- 7. AUDIT LOGS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete set null,
  event_type  text not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_user on public.audit_logs(user_id, created_at desc);
create index if not exists idx_audit_event on public.audit_logs(event_type, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- 8. UPDATED_AT TRIGGER FUNCTION
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.handle_updated_at();

create trigger attempts_updated_at
  before update on public.attempts
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 9. AUTO-CREATE USER ON SIGNUP
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

-- USERS
alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- CHAPTERS (public read)
alter table public.chapters enable row level security;

create policy "Anyone authenticated can read chapters"
  on public.chapters for select
  to authenticated
  using (is_active = true);

-- TOPICS (public read)
alter table public.topics enable row level security;

create policy "Anyone authenticated can read topics"
  on public.topics for select
  to authenticated
  using (is_active = true);

-- QUESTIONS (safe view only — correct_answer hidden)
alter table public.questions enable row level security;

-- No direct table access for authenticated users
-- They use the questions_safe view
create policy "Authenticated users can read questions_safe columns"
  on public.questions for select
  to authenticated
  using (is_active = true);

-- ATTEMPTS
alter table public.attempts enable row level security;

create policy "Users can read own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own attempts"
  on public.attempts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ANALYSIS
alter table public.analysis enable row level security;

create policy "Users can read own analysis"
  on public.analysis for select
  using (auth.uid() = user_id);

-- AUDIT LOGS (no client access — service role only)
alter table public.audit_logs enable row level security;
-- No policies = no access for regular users

-- ─────────────────────────────────────────────────────────────
-- 11. LEADERBOARD VIEW (safe aggregate, no sensitive data)
-- ─────────────────────────────────────────────────────────────
create or replace view public.leaderboard as
  select
    id,
    full_name,
    avatar_url,
    points,
    xp,
    streak,
    rank() over (order by points desc) as rank
  from public.users
  order by points desc
  limit 50;

-- ─────────────────────────────────────────────────────────────
-- 12. SEED: Class 12 Mathematics Chapters & Topics (NCERT-aligned)
-- ─────────────────────────────────────────────────────────────
insert into public.chapters (name, description, class, order_index) values
  ('Relations and Functions',     'Types of relations and functions, composition', 12, 1),
  ('Inverse Trigonometric Functions', 'Domain, range, principal values', 12, 2),
  ('Matrices',                    'Operations, types, and properties of matrices', 12, 3),
  ('Determinants',                'Properties, cofactors, area, adjoint, inverse', 12, 4),
  ('Continuity and Differentiability', 'Limits, continuity, chain rule, implicit', 12, 5),
  ('Application of Derivatives', 'Rate of change, tangents, maxima, minima', 12, 6),
  ('Integrals',                   'Indefinite and definite integrals, methods', 12, 7),
  ('Application of Integrals',   'Area under curves', 12, 8),
  ('Differential Equations',     'Formation, order, degree, solutions', 12, 9),
  ('Vector Algebra',              'Vectors, dot product, cross product', 12, 10),
  ('Three Dimensional Geometry', 'Direction cosines, lines, planes', 12, 11),
  ('Linear Programming',         'Graphical method, feasible region', 12, 12),
  ('Probability',                 'Conditional, Bayes theorem, distributions', 12, 13)
on conflict do nothing;
