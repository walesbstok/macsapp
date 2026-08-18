import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Suppress network log noise in sandboxed environment
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    }),
    experimentalAutoDetectLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  // Fallback if initializeFirestore is called multiple times or cache fails
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreDb;


