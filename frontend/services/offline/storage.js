import tempIds from './tempIds.js';

// [claude comment] 'responses' holds api payloads saved by the offline download (key = what the payload is), 'changeQueue' holds changes waiting to be sent to the server, 'notices' holds what the user should hear about sync, 'idMap' holds { [tempId]: realId }, 'uploadedImages' holds { [hash of a data: url]: S3 url }
const dbName = 'memcode-offline';
const imagesCacheName = 'offline-images';

let dbPromise = null;

const openDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('responses');
        request.result.createObjectStore('changeQueue', { keyPath: 'queueId', autoIncrement: true });
        request.result.createObjectStore('notices', { keyPath: 'noticeId', autoIncrement: true });
        request.result.createObjectStore('idMap');
        request.result.createObjectStore('uploadedImages');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    dbPromise.catch(() => { dbPromise = null; });
  }
  return dbPromise;
};

const transact = (storeName, mode, useStore) =>
  openDb().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    let result;
    const request = useStore(transaction.objectStore(storeName), (value) => { result = value; });
    transaction.oncomplete = () => resolve(request ? request.result : result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  }));

const getResponse = (key) =>
  transact('responses', 'readonly', (store) => store.get(key));

const putResponse = (key, value) =>
  transact('responses', 'readwrite', (store) => store.put(value, key));

const putResponses = (keyToValue) =>
  transact('responses', 'readwrite', (store) => {
    Object.entries(keyToValue).forEach(([key, value]) => store.put(value, key));
  });

const deleteResponses = (keys) =>
  transact('responses', 'readwrite', (store) => {
    keys.forEach((key) => store.delete(key));
  });

const replaceAllResponses = (keyToValue) =>
  transact('responses', 'readwrite', (store) => {
    store.clear();
    Object.entries(keyToValue).forEach(([key, value]) => store.put(value, key));
  });

// [claude comment] read and write happen in one transaction, so two changes made at once can't overwrite each other - does nothing if the key isn't downloaded
const updateResponse = (key, update) =>
  transact('responses', 'readwrite', (store) => {
    const request = store.get(key);
    request.onsuccess = () => {
      if (request.result !== undefined) store.put(update(request.result), key);
    };
  });

const replaceTempIdsInResponses = (keys, idMap) =>
  transact('responses', 'readwrite', (store) => {
    keys.forEach((key) => {
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result === undefined) return;
        const newKey = tempIds.replaceTempIdsInString(key, idMap);
        const newValue = tempIds.replaceTempIds(request.result, idMap);
        if (newKey !== key) {
          store.delete(key);
          store.put(newValue, newKey);
        } else if (newValue !== request.result) {
          store.put(newValue, key);
        }
      };
    });
  });

const addQueuedChange = (change) =>
  transact('changeQueue', 'readwrite', (store) => store.add(change));

const getQueuedChanges = () =>
  transact('changeQueue', 'readonly', (store) => store.getAll());

const deleteQueuedChange = (queueId) =>
  transact('changeQueue', 'readwrite', (store) => store.delete(queueId));

const countQueuedChanges = () =>
  transact('changeQueue', 'readonly', (store) => store.count());

const addNotice = (notice) =>
  transact('notices', 'readwrite', (store) => store.add(notice));

const getNotices = () =>
  transact('notices', 'readonly', (store) => store.getAll());

const deleteNotice = (noticeId) =>
  transact('notices', 'readwrite', (store) => store.delete(noticeId));

const getIdMap = () =>
  transact('idMap', 'readonly', (store, setResult) => {
    const idMap = {};
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        idMap[cursor.key] = cursor.value;
        cursor.continue();
      } else {
        setResult(idMap);
      }
    };
  });

const putIds = (idMap) =>
  transact('idMap', 'readwrite', (store) => {
    Object.entries(idMap).forEach(([tempId, realId]) => store.put(realId, tempId));
  });

const getUploadedImageUrl = (dataUrlHash) =>
  transact('uploadedImages', 'readonly', (store) => store.get(dataUrlHash));

const putUploadedImageUrl = (dataUrlHash, url) =>
  transact('uploadedImages', 'readwrite', (store) => store.put(url, dataUrlHash));

const openImagesCache = () =>
  caches.open(imagesCacheName);

const getDownloadedImageUrls = async (cache) =>
  new Set((await cache.keys()).map((request) => request.url));

// [claude comment] S3 sends CORS headers, other hosts (e.g. wikimedia) don't - their images can only be stored as opaque responses; 'reload' skips <img>-cached copies, which were saved without CORS headers
const downloadImage = async (cache, url) => {
  try {
    const response = await fetch(url, { mode: 'cors', cache: 'reload' });
    if (!response.ok) return false;
    await cache.put(url, response);
    return true;
  } catch {
    try {
      const response = await fetch(url, { mode: 'no-cors' });
      await cache.put(url, response);
      return true;
    } catch {
      return false;
    }
  }
};

const deleteImages = () =>
  caches.delete(imagesCacheName);

// [claude comment] the change queue and idMap stay, so changes made offline still get sent
const deleteDownload = () =>
  Promise.all([
    transact('responses', 'readwrite', (store) => store.clear()),
    deleteImages()
  ]);

const deleteNotices = () =>
  transact('notices', 'readwrite', (store) => store.clear());

export default {
  imagesCacheName,
  getResponse, putResponse, putResponses, deleteResponses, replaceAllResponses, updateResponse, replaceTempIdsInResponses,
  addQueuedChange, getQueuedChanges, deleteQueuedChange, countQueuedChanges,
  addNotice, getNotices, deleteNotice,
  getIdMap, putIds,
  getUploadedImageUrl, putUploadedImageUrl,
  openImagesCache, getDownloadedImageUrls, downloadImage,
  deleteImages, deleteDownload, deleteNotices
};
