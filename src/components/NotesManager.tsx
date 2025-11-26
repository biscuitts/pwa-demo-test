import { useState, useEffect } from 'react';
import { addNote, getAllNotes, deleteNote, Note } from '../utils/db';

/**
 * NotesManager Component
 *
 * Demonstrates offline-first data storage using IndexedDB:
 * - Add new notes
 * - Display all saved notes
 * - Delete individual notes
 * - Data persists across page refreshes
 * - Works completely offline
 *
 * Testing in Chrome DevTools:
 * 1. Open DevTools > Application > Storage > IndexedDB
 * 2. Expand "PWADemoDB" > "notes" to see stored notes
 * 3. Add notes while online, then go offline
 * 4. Refresh the page - notes should persist
 * 5. Add more notes while offline - they still save!
 */
export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      console.log('[NotesManager] Loading notes from IndexedDB...');
      const loadedNotes = await getAllNotes();
      setNotes(loadedNotes.reverse()); // Show newest first
      console.log('[NotesManager] Loaded', loadedNotes.length, 'notes');
    } catch (error) {
      console.error('[NotesManager] Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      console.warn('[NotesManager] Cannot save empty note');
      return;
    }

    try {
      console.log('[NotesManager] Saving new note:', noteText);
      await addNote(noteText);
      setNoteText('');
      await loadNotes(); // Reload notes to show the new one
    } catch (error) {
      console.error('[NotesManager] Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      console.log('[NotesManager] Deleting note with ID:', id);
      await deleteNote(id);
      await loadNotes(); // Reload notes after deletion
    } catch (error) {
      console.error('[NotesManager] Failed to delete note:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #6c757d',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    input: {
      flex: 1,
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#6c757d',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    notesList: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
    },
    noteItem: {
      padding: '12px',
      backgroundColor: '#fff',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '10px',
    },
    noteContent: {
      flex: 1,
      wordBreak: 'break-word' as const,
    },
    noteText: {
      fontSize: '14px',
      marginBottom: '5px',
    },
    noteTime: {
      fontSize: '12px',
      color: '#6c757d',
    },
    deleteButton: {
      padding: '5px 10px',
      fontSize: '12px',
      color: '#fff',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '40px 20px',
      color: '#6c757d',
      fontSize: '14px',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '20px',
      color: '#6c757d',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>📝 Offline Notes (IndexedDB)</div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your note..."
          style={styles.input}
        />
        <button
          onClick={handleAddNote}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
        >
          Save Note
        </button>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div style={styles.emptyState}>
          No notes yet. Add your first note above!
          <br />
          <small>Notes are stored locally and persist across refreshes.</small>
        </div>
      ) : (
        <div style={styles.notesList}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteItem}>
              <div style={styles.noteContent}>
                <div style={styles.noteText}>{note.text}</div>
                <div style={styles.noteTime}>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id!)}
                style={styles.deleteButton}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
