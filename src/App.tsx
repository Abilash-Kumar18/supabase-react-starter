import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabaseClient'
import { NoteForm } from './components/NoteForm'
import { NoteList } from './components/NoteList'
import type { Note } from './types'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // READ — runs once when the page loads
  // .from('notes')   -> your table name
  // .select('*')     -> SELECT * FROM notes
  // .order(...)      -> ORDER BY created_at DESC
  // ---------------------------------------------------------------------------
  const fetchNotes = useCallback(async () => {
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setNotes(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // ---------------------------------------------------------------------------
  // INSERT — .insert(...) -> INSERT INTO notes (content) VALUES (...)
  // .select() after insert asks Postgres to return the new row.
  // ---------------------------------------------------------------------------
  async function handleAdd(content: string) {
    if (!supabase) return

    const { data, error } = await supabase
      .from('notes')
      .insert({ content })
      .select()

    if (error) {
      setError(error.message)
      return
    }

    setError(null)
    setNotes((current) => [...(data ?? []), ...current])
  }

  // ---------------------------------------------------------------------------
  // DELETE — .delete() with .eq(...) -> DELETE FROM notes WHERE id = <id>
  // Always pair .delete()/.update() with .eq(), otherwise Supabase asks you
  // to confirm you really meant "every row in the table".
  // ---------------------------------------------------------------------------
  async function handleDelete(id: number) {
    if (!supabase) return

    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    setError(null)
    setNotes((current) => current.filter((note) => note.id !== id))
  }

  return (
    <main className="container">
      <header>
        <h1>Supabase + React</h1>
        <p className="muted">
          A tiny notes app showing how to read, insert and delete rows.
        </p>
      </header>

      <section className="card">
        {isSupabaseConfigured ? (
          <>
            <NoteForm onAdd={handleAdd} />
            {error && <p className="error">{error}</p>}
            <NoteList notes={notes} loading={loading} onDelete={handleDelete} />
          </>
        ) : (
          <SetupChecklist />
        )}
      </section>

      <footer>
        <p className="muted">
          Supabase queries live in <code>src/App.tsx</code> · the client is
          created in <code>src/lib/supabaseClient.ts</code>
        </p>
      </footer>
    </main>
  )
}

function SetupChecklist() {
  return (
    <div>
      <h2>Connect your database</h2>
      <p className="muted">
        The app is running, but no credentials were found. Do these steps:
      </p>
      <ol className="steps">
        <li>
          In Supabase: <strong>Project Settings → API</strong> and copy the{' '}
          <strong>Project URL</strong> and the <strong>anon public</strong> key.
        </li>
        <li>
          Copy <code>.env.example</code> to <code>.env</code> and paste them in.
        </li>
        <li>
          In the <strong>SQL Editor</strong>, run the <code>create table</code>{' '}
          statement found in <code>src/types.ts</code>.
        </li>
        <li>Restart the dev server (Vite only reads .env on startup).</li>
      </ol>
    </div>
  )
}
