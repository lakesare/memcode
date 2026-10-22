const CACHE_NAME = 'pdfs_v1';

const fileUrl = (pdfId) => `/api/pdfs/${pdfId}/file`;

let pdfjsPromise = null;
const getPdfjs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      return pdfjs;
    });
  }
  return pdfjsPromise;
};

const openCache = async () => {
  try {
    return await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
};

// [claude comment] books are big and never change, so after the first download they're read from the Cache API (tablet + flaky wifi)
const downloadPdfBytes = async (pdfId, expectedSize, onProgress) => {
  const cache = await openCache();
  const cached = cache ? await cache.match(fileUrl(pdfId)) : null;
  if (cached) {
    const cachedBytes = new Uint8Array(await cached.arrayBuffer());
    // [claude comment] a copy cut short (the browser quit while saving it) renders later pages without their scans, so it's downloaded again
    if (!expectedSize || cachedBytes.length === expectedSize) {
      return cachedBytes;
    } else {
      console.warn(`Cached pdf has ${cachedBytes.length} bytes instead of ${expectedSize}, downloading it again`);
      await cache.delete(fileUrl(pdfId));
    }
  }

  const response = await fetch(fileUrl(pdfId), {
    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
  });
  if (!response.ok) {
    throw new Error(`Couldn't download the pdf (${response.status})`);
  }

  const total = parseInt(response.headers.get('Content-Length'), 10) || 0;
  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress && onProgress(loaded, total);
  }
  const bytes = new Uint8Array(loaded);
  let offset = 0;
  chunks.forEach((chunk) => { bytes.set(chunk, offset); offset += chunk.length; });

  if (cache && (!expectedSize || bytes.length === expectedSize)) {
    cache.put(fileUrl(pdfId), new Response(bytes.slice(), { headers: { 'Content-Type': 'application/pdf' } })).catch(() => {});
  }
  return bytes;
};

const forgetPdfBytes = async (pdfId) => {
  const cache = await openCache();
  if (cache) await cache.delete(fileUrl(pdfId));
};

const loadPdf = async (pdfId, expectedSize, onProgress) => {
  const [pdfjs, bytes] = await Promise.all([getPdfjs(), downloadPdfBytes(pdfId, expectedSize, onProgress)]);
  const loadingTask = pdfjs.getDocument({
    data:                bytes,
    wasmUrl:             '/pdfjs/wasm/',
    cMapUrl:             '/pdfjs/cmaps/',
    cMapPacked:          true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
    iccUrl:              '/pdfjs/iccs/',
    // [claude comment] pdf.js draws glyphs itself instead of handing embedded fonts to the browser, which rejects slightly broken ones (Firefox: "rejected by sanitizer") and then shows a substitute font
    disableFontFace:     true
  });
  const pdfDocument = await loadingTask.promise;

  const pageSizes = await Promise.all(
    Array.from({ length: pdfDocument.numPages }, (_, index) =>
      pdfDocument.getPage(index + 1).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        return { width: viewport.width, height: viewport.height };
      })
    )
  );

  return { pdfjs, pdfDocument, pageSizes, loadingTask };
};

const uploadPdf = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/pdfs/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
    xhr.upload.onprogress = (event) => onProgress && onProgress(event.loaded, event.total);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed - check your connection'));
    xhr.send(formData);
  });

export { loadPdf, uploadPdf, forgetPdfBytes };
export default loadPdf;
