import { useState, type FormEvent } from 'react'

type NoteFormProps = {
  onAdd: (content: string) => Promise<void>
  disabled?: boolean
}

export function NoteForm({ onAdd, disabled = false }: NoteFormProps) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || saving) return

    setSaving(true)
    try {
      // The parent component performs the Supabase insert.
      await onAdd(trimmed)
      setContent('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        placeholder="Write a note..."
        onChange={(event) => setContent(event.target.value)}
        disabled={disabled || saving}
      />
      <button type="submit" disabled={disabled || saving || !content.trim()}>
        {saving ? 'Saving…' : 'Add note'}
      </button>
    </form>
  )
}
