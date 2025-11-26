import { useState } from 'react';

interface DataResponse {
  message: string;
  timestamp: string;
  features: string[];
  status: string;
}

/**
 * FetchData Component
 *
 * Demonstrates Cache API usage:
 * - Fetch data from network when online
 * - Serve from cache when offline
 * - Manually cache resources
 * - Show cache source indicator
 *
 * Testing:
 * 1. Click "Fetch Data" while online → fetches from network
 * 2. Go offline (DevTools > Network > Offline)
 * 3. Click "Fetch Data" again → serves from cache
 * 4. Check console to see cache hits/misses
 *
 * Chrome DevTools:
 * - Application > Cache Storage > See cached responses
 * - Network tab > Size column shows "(from ServiceWorker)" for cached responses
 */
export function FetchData() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'network' | 'cache' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setSource(null);

    const url = '/data/example.json';

    try {
      console.log('[FetchData] Attempting to fetch:', url);

      // First, try to fetch from network
      if (navigator.onLine) {
        try {
          const response = await fetch(url, { cache: 'no-cache' });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          setData(jsonData);
          setSource('network');

          console.log('[FetchData] ✅ Data fetched from NETWORK');

          // Cache the response for offline use
          if ('caches' in window) {
            const cache = await caches.open('pwa-demo-runtime');
            await cache.put(url, new Response(JSON.stringify(jsonData)));
            console.log('[FetchData] Data cached for offline use');
          }

          return;
        } catch (networkError) {
          console.warn('[FetchData] Network fetch failed:', networkError);
        }
      }

      // If network fails or offline, try cache
      if ('caches' in window) {
        console.log('[FetchData] Attempting to fetch from cache...');

        const cache = await caches.open('pwa-demo-runtime');
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          const jsonData = await cachedResponse.json();
          setData(jsonData);
          setSource('cache');
          console.log('[FetchData] ✅ Data fetched from CACHE');
          return;
        } else {
          console.log('[FetchData] No cached version found');
        }
      }

      throw new Error('Unable to fetch data from network or cache');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[FetchData] ❌ Fetch failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('pwa-demo-runtime');
        const deleted = await cache.delete('/data/example.json');

        if (deleted) {
          console.log('[FetchData] Cache cleared successfully');
          setData(null);
          setSource(null);
        }
      } catch (err) {
        console.error('[FetchData] Failed to clear cache:', err);
      }
    }
  };

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #ffc107',
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
      color: '#000',
      backgroundColor: '#ffc107',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    clearButton: {
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
    dataContainer: {
      padding: '15px',
      backgroundColor: '#fff',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      fontSize: '14px',
    },
    sourceBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      marginBottom: '10px',
      fontSize: '12px',
      fontWeight: 'bold',
      borderRadius: '4px',
      backgroundColor: source === 'network' ? '#28a745' : '#17a2b8',
      color: '#fff',
    },
    dataContent: {
      fontFamily: 'monospace',
      fontSize: '13px',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
    },
    error: {
      padding: '10px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      fontSize: '14px',
    },
    loading: {
      padding: '10px',
      textAlign: 'center' as const,
      color: '#6c757d',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>💾 Cache API Demo</div>

      <div style={styles.buttonContainer}>
        <button
          onClick={fetchData}
          disabled={isLoading}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0a800')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffc107')}
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>

        {data && (
          <button
            onClick={clearCache}
            style={styles.clearButton}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Clear Cache
          </button>
        )}
      </div>

      {isLoading && <div style={styles.loading}>Loading data...</div>}

      {error && <div style={styles.error}>❌ Error: {error}</div>}

      {data && !isLoading && (
        <div style={styles.dataContainer}>
          <div style={styles.sourceBadge}>
            {source === 'network' ? '🌐 FROM NETWORK' : '💾 FROM CACHE'}
          </div>

          <div style={styles.dataContent}>
            {JSON.stringify(data, null, 2)}
          </div>
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
        <strong>💡 Tip:</strong> Fetch while online, then go offline and fetch again
        to see the cache in action!
      </div>
    </div>
  );
}
