# Supabase Integration (Frontend + Database)

This app uses Supabase for data storage (and optional auth). The client is initialized from environment variables:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Do not commit actual values. These must be provided in the environment by the orchestrator or CI/CD.

Client factory: src/services/supabaseClient.js

```js
import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a Supabase client initialized using REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
   * Ensure these are set in environment (.env) by the orchestrator.
   */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    console.warn("Supabase env vars missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.");
  }
  return createClient(url || "https://placeholder.supabase.co", key || "public-anon-key");
}
```

Usage example:

```js
import { getSupabaseClient } from "../services/supabaseClient";
const supabase = getSupabaseClient();
const { data, error } = await supabase.from("quizzes").select("*");
```

Database schema (provisioned)

The following tables, indexes, RLS policies, and a view were created:

Tables:
- public.quizzes
  - id uuid primary key default gen_random_uuid()
  - code text unique not null
  - title text
  - status text default 'draft'
  - created_at timestamptz default now()

- public.questions
  - id uuid primary key default gen_random_uuid()
  - quiz_id uuid references public.quizzes(id) on delete cascade not null
  - index integer not null
  - text text not null
  - created_at timestamptz default now()

- public.options
  - id uuid primary key default gen_random_uuid()
  - question_id uuid references public.questions(id) on delete cascade not null
  - text text not null
  - is_correct boolean default false
  - created_at timestamptz default now()

- public.participants
  - id uuid primary key default gen_random_uuid()
  - quiz_id uuid references public.quizzes(id) on delete cascade not null
  - user_id uuid (optional linkage to auth.users)
  - name text not null
  - score integer default 0
  - joined_at timestamptz default now()

- public.answers
  - id uuid primary key default gen_random_uuid()
  - participant_id uuid references public.participants(id) on delete cascade not null
  - question_id uuid references public.questions(id) on delete cascade not null
  - option_id uuid references public.options(id) on delete set null
  - correct boolean
  - time_ms integer
  - created_at timestamptz default now()

Indexes:
- questions(quiz_id)
- options(question_id)
- participants(quiz_id)
- answers(participant_id), answers(question_id)

RLS:
- Enabled on all tables (quizzes, questions, options, participants, answers)
- Public read-only for content tables:
  - quizzes: select using (true)
  - questions: select using (true)
  - options: select using (true)
- Participants: insert with check (true), select using (true)
- Answers: insert with check (true), select using (true)

Note: Policies are permissive for demo purposes. Harden for production (e.g., tie to auth.uid() or restrict writes to server role via service key).

View:
- public.v_leaderboard:
  Aggregates scores per participant id by summing 10 points per correct answer. Columns: quiz_id, participant_id, name, score.

Grants:
- Schema usage for anon and authenticated
- Select on all tables for anon and authenticated

Environment variables

- REACT_APP_SUPABASE_URL: Your Supabase project URL (e.g., https://xxxx.supabase.co)
- REACT_APP_SUPABASE_KEY: Public anon key

Project setup steps (dashboard):

1. Authentication -> URL Configuration:
   - Site URL: your local dev or production domain (e.g., http://localhost:3000 or https://yourapp.com)
   - Redirect URLs: include http://localhost:3000/** and your prod domain /**

2. SQL (automated): The agent already created schema and RLS via Supabase tools. If you need to recreate, run these via the SQL editor:
   - Enable extension:
     create extension if not exists pgcrypto;
   - Create tables, indexes, and policies as described above.

3. Security (recommended for production):
   - Restrict participants/answers insert to authenticated users, or enforce quiz join tokens.
   - Replace permissive select using (true) with row-specific checks if needed.

Frontend integration notes

- src/services/supabaseClient.js is the single source of truth for the client.
- The rest of the app currently uses mock REST and WebSocket layers. You may progressively replace these with Supabase Row Level changes, RPCs, or Realtime channels.
- Never hardcode URLs or keys in code. Rely on environment variables.

Troubleshooting

- If you see "Supabase env vars missing" in console:
  - Ensure .env contains REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY before starting the dev server.
  - Restart the dev server after changing env vars.

- If client cannot read data:
  - Confirm RLS policies allow select for anon or authenticated role you use.
  - Verify grants on public schema and tables to anon/authenticated.

- If you introduce email/password or magic link auth:
  - Add redirect URLs in dashboard.
  - Ensure routes exist (e.g., /auth/callback).
