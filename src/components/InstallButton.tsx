import { useState, useEffect } from 'react';

// Extended Window interface to include beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallButton Component
 *
 * Demonstrates PWA installation flow:
 * 1. Listens for 'beforeinstallprompt' event
 * 2. Shows install button when app is installable
 * 3. Triggers installation prompt on click
 * 4. Logs installation outcome to console
 *
 * Testing:
 * - Open Chrome DevTools > Application > Manifest
 * - Check "Application" section for install status
 * - Desktop: Look for install icon in address bar
 */
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('[InstallButton] Setting up beforeinstallprompt listener');

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();

      console.log('[InstallButton] beforeinstallprompt event fired - app is installable!');

      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('[InstallButton] App successfully installed!');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('[InstallButton] Install prompt not available');
      return;
    }

    console.log('[InstallButton] Showing install prompt...');

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's choice
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[InstallButton] User response: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('[InstallButton] User accepted the install prompt');
    } else {
      console.log('[InstallButton] User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #4A90E2',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#4A90E2',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#999',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '6px',
      cursor: 'not-allowed',
    },
    status: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#666',
    },
    installed: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#28a745',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>📱 PWA Installation</div>

      {isInstalled ? (
        <div style={styles.installed}>✅ App is installed!</div>
      ) : isInstallable ? (
        <>
          <button
            onClick={handleInstallClick}
            style={styles.button}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4A90E2')}
          >
            Install as App
          </button>
          <div style={styles.status}>
            Click to install this app to your device
          </div>
        </>
      ) : (
        <>
          <button style={styles.buttonDisabled} disabled>
            Install as App
          </button>
          <div style={styles.status}>
            {window.matchMedia('(display-mode: standalone)').matches
              ? 'Already running as installed app'
              : 'App is not installable (may already be installed or install criteria not met)'}
          </div>
        </>
      )}
    </div>
  );
}
