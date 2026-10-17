/**
 * Shape of one row in your "notes" table.
 *
 * SQL used to create it (Supabase -> SQL Editor):
 *
 *   create table notes (
 *     id bigint generated always as identity primary key,
 *     content text not null,
 *     created_at timestamptz not null default now()
 *   );
 *
 *   alter table notes enable row level security;
 *   create policy "anyone can read notes"  on notes for select using (true);
 *   create policy "anyone can insert notes" on notes for insert with check (true);
 *   create policy "anyone can delete notes" on notes for delete using (true);
 */
export type Note = {
  id: number
  content: string
  created_at: string
}
