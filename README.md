# Progressive Web App (PWA) Demo

A comprehensive, polished demonstration of Progressive Web App features built with Vite, React, and TypeScript. This project showcases PWA capabilities including offline support, caching strategies, local data persistence, and background synchronization.

## 🎯 Purpose

This PWA demo is designed for technical presentations and learning. It demonstrates:

- ✅ **PWA Installation Flow** - Add to home screen functionality
- ✅ **Offline-First Architecture** - Works without network connection
- ✅ **Service Worker Lifecycle** - Install, activate, and fetch events with detailed logging
- ✅ **Cache API Usage** - Manual caching and cache-first strategies
- ✅ **IndexedDB Storage** - Persistent local data storage
- ✅ **Background Sync** - Queue tasks for later processing
- ✅ **Online/Offline Detection** - Real-time network status updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
pwa-demo/
├── public/
│   ├── data/
│   │   └── example.json          # Demo data for Cache API
│   ├── pwa-192x192.png           # PWA icon (192x192)
│   ├── pwa-512x512.png           # PWA icon (512x512)
│   ├── apple-touch-icon.png      # iOS icon
│   └── sw-custom.js              # Custom service worker (reference)
├── src/
│   ├── components/
│   │   ├── InstallButton.tsx     # PWA installation prompt
│   │   ├── StatusBanner.tsx      # Online/offline indicator
│   │   ├── NotesManager.tsx      # IndexedDB demo
│   │   ├── BackgroundSync.tsx    # Background sync demo
│   │   └── FetchData.tsx         # Cache API demo
│   ├── utils/
│   │   └── db.ts                 # IndexedDB utilities
│   ├── App.tsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── vite.config.ts                # Vite + PWA configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## 🧪 Testing Guide

### Testing PWA Features in Chrome DevTools

#### 1. Service Worker Testing

1. Open Chrome DevTools (`F12` or `Cmd+Option+I`)
2. Go to **Application** tab → **Service Workers**
3. Observe the registered service worker
4. Check the service worker lifecycle (installing → waiting → active)
5. Use "Offline" checkbox to simulate offline mode
6. Click "Update" to test service worker updates
7. Check "Bypass for network" to test without service worker

**What to observe:**
- Service worker registration status
- Lifecycle state changes
- Console logs for install/activate/fetch events

#### 2. Cache Storage Testing

1. **Application** tab → **Cache Storage**
2. Expand cache entries (e.g., `pwa-demo-v1`, `pwa-demo-runtime`)
3. View cached resources
4. Right-click to delete specific caches

**What to observe:**
- Which files are cached
- Cache names and versions
- Cached responses and their sizes

#### 3. IndexedDB Testing

1. **Application** tab → **IndexedDB** → **PWADemoDB**
2. Expand the `notes` object store
3. Add notes in the app and watch them appear
4. Refresh the page - notes persist!
5. Try offline mode - notes still work

**What to observe:**
- Notes being added to IndexedDB
- Data structure (id, text, createdAt)
- Persistence across page refreshes

#### 4. Network Tab Testing

1. Go to **Network** tab
2. Refresh the page
3. Look at the **Size** column for resources
4. Resources served by service worker show "(from ServiceWorker)"
5. Toggle offline mode and refresh - resources still load!

**What to observe:**
- Which resources come from service worker vs. network
- Cache hits and misses
- Network requests being intercepted

#### 5. Console Logging

All PWA events are logged to the console with clear prefixes:

- `[App]` - Main application events
- `[Service Worker]` - Service worker lifecycle and fetch events
- `[InstallButton]` - Installation prompt events
- `[StatusBanner]` - Network status changes
- `[NotesManager]` - IndexedDB operations
- `[BackgroundSync]` - Sync events
- `[FetchData]` - Cache API operations
- `[IndexedDB]` - Database operations

### Testing Offline Functionality

#### Method 1: DevTools Network Tab
1. Open DevTools → **Network** tab
2. Change throttling dropdown from "No throttling" to **"Offline"**
3. Try using the app - it should work!

#### Method 2: Service Worker Checkbox
1. Open DevTools → **Application** tab → **Service Workers**
2. Check the **"Offline"** checkbox
3. Interact with the app

#### Method 3: Airplane Mode
1. Enable airplane mode on your device
2. The app should continue working
3. The status banner will show "Offline (using cached data)"

### Testing PWA Installation

#### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar (⊕ or computer icon)
2. Click it to install
3. Or use the "Install as App" button in the UI
4. The app will open in a standalone window

#### Mobile (Android/iOS)
1. Open the app in Chrome (Android) or Safari (iOS)
2. Tap the browser menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app icon will be added to your home screen

**What to observe:**
- `beforeinstallprompt` event firing (check console)
- Installation prompt appearing
- `appinstalled` event after successful installation
- App running in standalone mode (no browser UI)

### Testing Background Sync

1. Go offline using DevTools
2. Click "Queue Sync Task" button
3. Task appears in the queue
4. Go back online
5. Watch console - sync event fires!
6. Queue is cleared

**Note:** Background Sync API may not be supported in all browsers. The demo includes a fallback simulation.

## 🔍 Key Features Explained

### 1. Service Worker

The app uses `vite-plugin-pwa` with Workbox to generate a production-ready service worker automatically. Key features:

- **Precaching**: Critical assets cached on install
- **Runtime caching**: Additional resources cached as needed
- **Cache-first strategy**: Offline-first for same-origin requests
- **Lifecycle logging**: Console logs for all events

### 2. PWA Manifest

Configured in `vite.config.ts`:
- App name and description
- Icons (192x192 and 512x512)
- Theme and background colors
- Display mode (standalone)
- Start URL and scope

### 3. IndexedDB Storage

Used for offline note-taking:
- Object store: `notes`
- Auto-incrementing IDs
- Indexed by creation timestamp
- Full CRUD operations
- Works completely offline

### 4. Cache API

Manual caching demonstration:
- Fetch data from network when online
- Serve from cache when offline
- Cache responses programmatically
- Show cache source indicator

### 5. Online/Offline Detection

Real-time network status:
- `navigator.onLine` API
- Event listeners for `online`/`offline` events
- Visual indicator banner
- Console logging

## 🛠️ Development

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Type checking
npm run build    # Runs tsc && vite build

# Production preview
npm run preview

# Linting
npm run lint
```

### Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **vite-plugin-pwa** - PWA generation
- **Workbox** - Service worker utilities
- **IndexedDB** - Local database
- **ESLint** - Code quality

### PWA Configuration

Edit `vite.config.ts` to customize:
- Manifest properties (name, colors, icons)
- Workbox caching strategies
- Service worker generation options
- Dev mode PWA behavior

## 📱 Browser Support

### Full PWA Support
- Chrome/Edge 90+
- Safari 16.4+ (iOS 16.4+)
- Firefox 90+

### Partial Support
- Safari 11.1-16.3 (limited features)
- Older browsers (basic functionality only)

### Required Features
- Service Workers
- Cache API
- IndexedDB
- Fetch API
- Promises

## 🎓 Learning Resources

### Viewing PWA Details

1. **Manifest**: DevTools → Application → Manifest
2. **Service Workers**: DevTools → Application → Service Workers
3. **Cache Storage**: DevTools → Application → Cache Storage
4. **IndexedDB**: DevTools → Application → IndexedDB
5. **Network**: DevTools → Network (filter by service worker)

### Console Logs

Every PWA action logs detailed information:
- ✅ Success events (green checkmarks)
- ❌ Errors (red X)
- ⚠️ Warnings (yellow triangles)
- ℹ️ Info (blue info icons)

### Lighthouse Audit

Run a PWA audit:
1. DevTools → **Lighthouse** tab
2. Select "Progressive Web App"
3. Click "Generate report"
4. Review PWA score and recommendations

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS or localhost
- Clear browser cache and reload
- Check service worker scope

### Install Prompt Not Showing
- PWA criteria must be met (HTTPS, manifest, service worker, icons)
- May already be installed
- Check DevTools → Application → Manifest for issues
- Desktop Chrome: look for install icon in address bar

### Offline Mode Not Working
- Service worker must be active
- Check Cache Storage has content
- Use DevTools offline mode (not airplane mode) for testing
- Check console for fetch errors

### IndexedDB Issues
- Check browser supports IndexedDB
- Open DevTools → Application → IndexedDB
- Clear database if corrupted
- Check console for transaction errors

## 📄 License

MIT License - feel free to use this demo for learning and presentations!

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your own needs!

---

**Built for engineers learning PWAs** 🚀

*For questions or issues, check the console logs - they contain detailed debugging information!*
