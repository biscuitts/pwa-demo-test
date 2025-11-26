import { useState, useEffect } from 'react';

/**
 * StatusBanner Component
 *
 * Displays the current network status:
 * - Online: Green banner with "Online (live network)"
 * - Offline: Red banner with "Offline (using cached data)"
 *
 * Demonstrates:
 * - navigator.onLine API
 * - online/offline event listeners
 * - Real-time status updates
 *
 * Testing in Chrome DevTools:
 * 1. Open DevTools > Network tab
 * 2. Change throttling to "Offline"
 * 3. Watch banner update in real-time
 * 4. Try interacting with the app while offline
 */
export function StatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    console.log('[StatusBanner] Initial online status:', navigator.onLine);

    const handleOnline = () => {
      console.log('[StatusBanner] Network status changed: ONLINE');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[StatusBanner] Network status changed: OFFLINE');
      setIsOnline(false);
    };

    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const styles = {
    banner: {
      padding: '15px 20px',
      textAlign: 'center' as const,
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: isOnline ? '#28a745' : '#dc3545',
      transition: 'background-color 0.3s ease',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    icon: {
      marginRight: '8px',
    },
  };

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>{isOnline ? '🟢' : '🔴'}</span>
      {isOnline ? 'Online (live network)' : 'Offline (using cached data)'}
    </div>
  );
}
