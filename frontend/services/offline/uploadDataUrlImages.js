import fetchWrapper from '~/api/services/fetchWrapper';
import { hashString } from '~/../services/hashProblem';
import storage from './storage';

// [claude comment] an image pasted while its upload failed (e.g. offline) stays inside the flashcard as a data: url - this uploads it to S3 right before the flashcard is sent to the server, the way pasting would have

// [claude comment] atob() rather than fetch(dataUrl) - a TypeError would read as "offline" and keep the change queued forever
const dataUrlToBlob = (dataUrl) => {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.slice('data:'.length).split(';')[0];
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
};

const uploadDataUrl = async (dataUrl) => {
  const dataUrlHash = hashString(dataUrl);
  const uploadedUrl = await storage.getUploadedImageUrl(dataUrlHash);
  if (uploadedUrl) return uploadedUrl;

  const formData = new FormData();
  formData.append('file', dataUrlToBlob(dataUrl));
  const { url } = await fetchWrapper(false, fetch('/api/files/upload', { method: 'POST', body: formData }));
  await storage.putUploadedImageUrl(dataUrlHash, url);
  return url;
};

const uploadImagesInHtml = async (html) => {
  if (!html.includes('src="data:')) return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const img of doc.body.querySelectorAll('img[src^="data:"]')) {
    try {
      img.setAttribute('src', await uploadDataUrl(img.getAttribute('src')));
    } catch (error) {
      // [claude comment] no connection keeps the whole change queued, anything else leaves this image a data: url
      if (error instanceof TypeError) throw error;
    }
  }
  return doc.body.innerHTML;
};

const uploadDataUrlImages = async (problem) => {
  const content = {};
  for (const [key, value] of Object.entries(problem.content)) {
    content[key] = typeof value === 'string' ? await uploadImagesInHtml(value) : value;
  }
  return { ...problem, content };
};

export default uploadDataUrlImages;
