import { useState } from 'react';

/**
 * BackgroundSync Component
 *
 * Demonstrates Background Sync API (with fallback simulation):
 * - Queue sync tasks when offline
 * - Automatically sync when connection is restored
 * - Show sync status and queue
 *
 * How it works:
 * 1. When offline, tasks are queued locally
 * 2. Service worker listens for 'sync' event
 * 3. When online, SW processes the queue
 *
 * Testing:
 * 1. Go offline (DevTools > Network > Offline)
 * 2. Click "Queue Sync Task"
 * 3. Go back online
 * 4. Watch console for sync event
 *
 * Note: Background Sync API may not be supported in all browsers.
 * This demo includes a fallback simulation for demonstration.
 */
export function BackgroundSync() {
  const [syncQueue, setSyncQueue] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const queueSyncTask = async () => {
    const taskId = `task-${Date.now()}`;
    const taskDescription = `Sync task queued at ${new Date().toLocaleTimeString()}`;

    console.log('[BackgroundSync] Queueing sync task:', taskId);

    // Add to local queue
    setSyncQueue((prev) => [...prev, taskDescription]);

    // Check if Background Sync API is supported
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-notes');
        console.log('[BackgroundSync] Background sync registered successfully');
      } catch (error) {
        console.error('[BackgroundSync] Failed to register background sync:', error);
        simulateSync();
      }
    } else {
      console.warn('[BackgroundSync] Background Sync API not supported, using fallback');
      simulateSync();
    }
  };

  const simulateSync = () => {
    // Simulate sync after a delay (when online)
    if (navigator.onLine) {
      console.log('[BackgroundSync] Simulating immediate sync (online)...');
      setTimeout(() => {
        processSync();
      }, 1000);
    } else {
      console.log('[BackgroundSync] Will sync when connection is restored');

      // Listen for online event
      const handleOnline = () => {
        console.log('[BackgroundSync] Connection restored, processing sync...');
        processSync();
        window.removeEventListener('online', handleOnline);
      };

      window.addEventListener('online', handleOnline);
    }
  };

  const processSync = () => {
    console.log('[BackgroundSync] Processing sync queue...');
    setLastSyncTime(new Date());
    setSyncQueue([]);
    console.log('[BackgroundSync] Sync completed successfully!');
  };

  const manualSync = () => {
    if (syncQueue.length === 0) {
      console.warn('[BackgroundSync] No tasks in queue to sync');
      return;
    }

    console.log('[BackgroundSync] Manually triggering sync...');
    processSync();
  };

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #17a2b8',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#17a2b8',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    secondaryButton: {
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
    info: {
      padding: '15px',
      backgroundColor: '#fff',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      fontSize: '14px',
    },
    queueTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#333',
    },
    queueItem: {
      padding: '8px',
      marginBottom: '5px',
      backgroundColor: '#e7f3f5',
      borderRadius: '4px',
      fontSize: '13px',
    },
    emptyQueue: {
      color: '#6c757d',
      fontStyle: 'italic' as const,
    },
    syncTime: {
      marginTop: '10px',
      fontSize: '13px',
      color: '#28a745',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🔄 Background Sync Demo</div>

      <div style={styles.buttonContainer}>
        <button
          onClick={queueSyncTask}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#138496')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#17a2b8')}
        >
          Queue Sync Task
        </button>

        {syncQueue.length > 0 && (
          <button
            onClick={manualSync}
            style={styles.secondaryButton}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Sync Now ({syncQueue.length})
          </button>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.queueTitle}>Sync Queue:</div>

        {syncQueue.length === 0 ? (
          <div style={styles.emptyQueue}>No pending sync tasks</div>
        ) : (
          syncQueue.map((task, index) => (
            <div key={index} style={styles.queueItem}>
              {task}
            </div>
          ))
        )}

        {lastSyncTime && (
          <div style={styles.syncTime}>
            ✅ Last sync: {lastSyncTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
        <strong>💡 Tip:</strong> Try going offline (DevTools → Network → Offline),
        queue a task, then go back online to see sync in action!
      </div>
    </div>
  );
}
