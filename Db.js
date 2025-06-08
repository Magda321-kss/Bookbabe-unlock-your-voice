const DB_NAME = 'bookbabeDB';
const DB_VERSION = 1;
const STORE_NAME = 'transcripts';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error opening database');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function saveTranscript(text, timestamp = new Date().toISOString()) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.add({ text, timestamp });
}

export async function getTranscripts() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error retrieving transcripts');
  });
}

export async function exportTranscript(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const blob = new Blob([result.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookbabe_transcript_${id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } else {
        reject('Transcript not found');
      }
    };

    request.onerror = () => reject('Error exporting transcript');
  });
}
