import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface OfflineDiagnostic {
  id: string;
  disease_class: string;
  confidence: number;
  timestamp: string;
  image_base64: string; // Stored offline
  synced: boolean;
}

interface SaruPolDB extends DBSchema {
  diagnostic_queue: {
    key: string;
    value: OfflineDiagnostic;
    indexes: { 'by-sync-status': any };
  };
}

let dbPromise: Promise<IDBPDatabase<SaruPolDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<SaruPolDB>('sarupol_edge_db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('diagnostic_queue', { keyPath: 'id' });
      store.createIndex('by-sync-status', 'synced');
    },
  });
}

export async function saveDiagnosticLocally(diagnostic: OfflineDiagnostic): Promise<void> {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.put('diagnostic_queue', diagnostic);
}

export async function getPendingDiagnostics(): Promise<OfflineDiagnostic[]> {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return db.getAllFromIndex('diagnostic_queue', 'by-sync-status', false);
}

export async function markDiagnosticSynced(id: string): Promise<void> {
  if (!dbPromise) return;
  const db = await dbPromise;
  const diag = await db.get('diagnostic_queue', id);
  if (diag) {
    diag.synced = true;
    await db.put('diagnostic_queue', diag);
  }
}

export async function getDiagnosticHistoryLocal(): Promise<OfflineDiagnostic[]> {
  if (!dbPromise) return [];
  const db = await dbPromise;
  const all = await db.getAll('diagnostic_queue');
  // Sort descending by timestamp
  return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
