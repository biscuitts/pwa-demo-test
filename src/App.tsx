import { useEffect } from 'react';
import { StatusBanner } from './components/StatusBanner';
import { InstallButton } from './components/InstallButton';
import { NotesManager } from './components/NotesManager';
import { BackgroundSync } from './components/BackgroundSync';
import { FetchData } from './components/FetchData';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './App.css';

/**
 * Main App Component
 *
 * Integrates all PWA demonstration features:
 * - Service Worker registration with lifecycle logging
 * - Online/offline status indicator
 * - PWA installation prompt
 * - Offline note-taking with IndexedDB
 * - Background sync demonstration
 * - Cache API usage demonstration
 *
 * This app demonstrates:
 * ✅ Installation flow
 * ✅ Offline caching
 * ✅ Local persistent data
 * ✅ Sync-like behavior
 * ✅ Service worker events
 * ✅ Online/offline reactivity
 */
function App() {
  // Use vite-plugin-pwa's automatic service worker registration
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('[App] ✅ Service Worker registered successfully!');
      console.log('[App] Scope:', registration?.scope);
      console.log('[App] Registration:', registration);

      if (registration) {
        if (registration.installing) {
          console.log('[App] Service Worker state: INSTALLING');
        } else if (registration.waiting) {
          console.log('[App] Service Worker state: WAITING');
        } else if (registration.active) {
          console.log('[App] Service Worker state: ACTIVE');
        }
      }
    },
    onRegisterError(error) {
      console.error('[App] ❌ Service Worker registration failed:', error);
    },
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log('[App] Service Worker supported');

      // Listen for service worker controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[App] Service Worker controller changed - new SW is active');
      });
    } else {
      console.warn('[App] Service Worker not supported in this browser');
    }

    // Log PWA detection
    console.log('[App] Checking if running as installed PWA...');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    console.log('[App] Running as installed PWA:', isStandalone);

    // If there's a service worker update available, log it
    if (needRefresh) {
      console.log('[App] New service worker available! Call updateServiceWorker() to update.');
    }
  }, [needRefresh, updateServiceWorker]);

  return (
    <div className="app">
      <StatusBanner />

      <div className="container">
        <header className="header">
          <h1>Progressive Web App Demo</h1>
          <p className="subtitle">
            A comprehensive demonstration of PWA features including offline support,
            caching, and local storage
          </p>
        </header>

        <div className="info-box">
          <h3>🎯 What This Demo Shows</h3>
          <ul>
            <li><strong>Installation:</strong> Add this app to your home screen</li>
            <li><strong>Offline Support:</strong> Works without network connection</li>
            <li><strong>Caching:</strong> Service worker caches assets and data</li>
            <li><strong>Local Storage:</strong> IndexedDB persists your notes</li>
            <li><strong>Background Sync:</strong> Queue tasks for later processing</li>
            <li><strong>Online/Offline Detection:</strong> Real-time status updates</li>
          </ul>
          <p className="tip">
            💡 <strong>Open Chrome DevTools</strong> (F12) and check the Console tab
            to see detailed PWA lifecycle events and caching decisions!
          </p>
        </div>

        <div className="components-grid">
          <InstallButton />
          <NotesManager />
          <BackgroundSync />
          <FetchData />
        </div>

        <footer className="footer">
          <h3>🔍 Testing Guide</h3>
          <div className="testing-steps">
            <div className="test-section">
              <h4>Service Worker (DevTools → Application)</h4>
              <ol>
                <li>Open "Service Workers" section</li>
                <li>Check service worker status and lifecycle</li>
                <li>Try "Offline" checkbox to simulate offline mode</li>
              </ol>
            </div>

            <div className="test-section">
              <h4>Cache Storage (DevTools → Application)</h4>
              <ol>
                <li>Open "Cache Storage" section</li>
                <li>Explore cached resources in different caches</li>
                <li>See what's being cached by the service worker</li>
              </ol>
            </div>

            <div className="test-section">
              <h4>IndexedDB (DevTools → Application)</h4>
              <ol>
                <li>Open "IndexedDB" → "PWADemoDB"</li>
                <li>View stored notes in the "notes" object store</li>
                <li>Watch data persist across refreshes</li>
              </ol>
            </div>

            <div className="test-section">
              <h4>Network Tab</h4>
              <ol>
                <li>Watch for "(from ServiceWorker)" in Size column</li>
                <li>Toggle offline mode to test caching</li>
                <li>See which resources come from cache vs network</li>
              </ol>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
