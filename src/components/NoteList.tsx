import type { Note } from '../types'

type NoteListProps = {
  notes: Note[]
  loading: boolean
  onDelete: (id: number) => Promise<void>
}

export function NoteList({ notes, loading, onDelete }: NoteListProps) {
  if (loading) return <p className="muted">Loading notes…</p>

  if (notes.length === 0) {
    return <p className="muted">No notes yet. Add the first one above.</p>
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <div>
            <p className="note-content">{note.content}</p>
            <time dateTime={note.created_at}>
              {new Date(note.created_at).toLocaleString()}
            </time>
          </div>
          <button className="ghost" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
