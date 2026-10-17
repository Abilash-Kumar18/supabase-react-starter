# Supabase + React Starter

A minimal Vite + React + TypeScript app with one page that talks to a Supabase
table (`notes`). Every Supabase call is written out and commented so you can
follow along and learn.

## 1. Install

```bash
npm install
npm run dev      # http://localhost:5173
```

The app runs immediately — it just shows setup instructions until it finds
your credentials.

## 2. Create the table

Supabase Dashboard → **SQL Editor** → run:

```sql
create table notes (
  id bigint generated always as identity primary key,
  content text not null,
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

create policy "anyone can read notes"   on notes for select using (true);
create policy "anyone can insert notes" on notes for insert with check (true);
create policy "anyone can delete notes" on notes for delete using (true);
```

> Row Level Security (RLS) is Supabase's permission system. With RLS enabled
> and no policy, the table is locked. These policies are wide open for
> learning — real apps restrict them per user.

## 3. Connect your project

1. Supabase Dashboard → **Project Settings → API**
2. Copy the **Project URL** and the **anon public** key
3. Copy `.env.example` to `.env` and paste them in:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

4. Restart `npm run dev` (Vite only reads `.env` at startup)

The page now loads your notes instead of the checklist.

## Where to look

| File | What it shows |
| --- | --- |
| `src/lib/supabaseClient.ts` | Creating the client from env variables |
| `src/App.tsx` | The three core operations, commented: **select**, **insert**, **delete** |
| `src/components/NoteForm.tsx` | Controlled input + submit handling |
| `src/components/NoteList.tsx` | Rendering rows, loading and empty states |
| `src/types.ts` | The row shape + the SQL that matches it |

## The query pattern

Every query follows the same chain style:

```ts
const { data, error } = await supabase
  .from('notes')     // table
  .select('*')       // read
  .order('created_at', { ascending: false })
```

`.from().select()` → read · `.from().insert()` → add ·
`.from().delete().eq('id', id)` → remove. Check the `{ data, error }` result
instead of using try/catch — Supabase returns errors, it does not throw.

## Notes on safety

- The `anon` key is designed to be public; your table is protected by RLS.
- Never put the `service_role` key in a frontend or in a `VITE_` variable.
- `.env` is git-ignored; `.env.example` is the template you commit.

## Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```
