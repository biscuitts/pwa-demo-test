import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log app initialization
console.log('='.repeat(60));
console.log('🚀 PWA Demo App Starting...');
console.log('='.repeat(60));
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Service Worker Support:', 'serviceWorker' in navigator ? 'YES' : 'NO');
console.log('Cache API Support:', 'caches' in window ? 'YES' : 'NO');
console.log('IndexedDB Support:', 'indexedDB' in window ? 'YES' : 'NO');
console.log('Background Sync Support:', 'sync' in ServiceWorkerRegistration.prototype ? 'YES' : 'NO');
console.log('='.repeat(60));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Log when DOM is ready
console.log('✅ React app mounted to DOM');
