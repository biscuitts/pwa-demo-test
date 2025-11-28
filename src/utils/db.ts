// IndexedDB utility for notes storage
// Demonstrates offline-first local data persistence

export interface Note {
  id?: number;
  text: string;
  createdAt: number;
}

const DB_NAME = 'PWADemoDB';
const STORE_NAME = 'notes';
const DB_VERSION = 1;

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    console.log('[IndexedDB] Initializing database...');

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[IndexedDB] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('[IndexedDB] Database opened successfully');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      console.log('[IndexedDB] Database upgrade needed, creating object store...');

      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });

        objectStore.createIndex('createdAt', 'createdAt', { unique: false });

        console.log('[IndexedDB] Object store created:', STORE_NAME);
      }
    };
  });
};

// Add a new note
export const addNote = async (text: string): Promise<number> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const note: Note = {
      text,
      createdAt: Date.now(),
    };

    const request = store.add(note);

    request.onsuccess = () => {
      console.log('[IndexedDB] Note added successfully with ID:', request.result);
      resolve(request.result as number);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to add note:', request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get all notes
export const getAllNotes = async (): Promise<Note[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const notes = request.result as Note[];
      console.log('[IndexedDB] Retrieved notes:', notes.length);
      resolve(notes);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to retrieve notes:', request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete a note
export const deleteNote = async (id: number): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('[IndexedDB] Note deleted successfully:', id);
      resolve();
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to delete note:', request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Clear all notes
export const clearAllNotes = async (): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('[IndexedDB] All notes cleared successfully');
      resolve();
    };

    request.onerror = () => {
      console.error('[IndexedDB] Failed to clear notes:', request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};
