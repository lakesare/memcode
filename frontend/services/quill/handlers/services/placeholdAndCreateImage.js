import Quill, { Delta } from 'quill';
import imageCompression from 'browser-image-compression';

import fromFileToDataUrl from '~/services/fromFileToDataUrl';
import preloadImage from '~/services/preloadImage';
import fetchWrapper from '~/api/services/fetchWrapper';
import shiftKeyTracker from '~/services/capsLockTracker';

// File upload function (moved from FileApi.js since it's only used here)
const uploadFile = async (dispatch, file) => {
  // Compress image before upload if it's an image file
  let fileToUpload = file;

  if (file.type.startsWith('image/')) {
    // Check if user pressed Shift recently to skip compression (for formulas)
    const shouldSkipCompression = true; // shiftKeyTracker.shouldSkipCompression();

    if (shouldSkipCompression) {
      console.log('Skipping compression - Shift was pressed (formula mode)');
    } else {
      try {
        // Compression options - optimize dimensions while preserving quality
        const options = {
          maxWidthOrHeight: 600, // Match flashcard display width
          useWebWorker: true, // Non-blocking compression
          preserveExif: false, // Remove metadata to save space
          initialQuality: 0.95 // High quality, let dimension reduction do the work
        };

        fileToUpload = await imageCompression(file, options);
        console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
      } catch (error) {
        console.warn('Image compression failed, uploading original:', error);
        // Continue with original file if compression fails
      }
    }

    // Reset Shift key tracker after compression decision is made
    shiftKeyTracker.reset();
  }

  const formData = new FormData();
  // 'file' string can be anything, it just has to correspond to uploadFileToAwsS3.single('file')
  formData.append('file', fileToUpload);

  return fetchWrapper(
    dispatch,
    fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
  );
};

const findReactComponent = (el, predicate) => {
  const fiberKey = Object.keys(el).find((key) => key.startsWith('__reactFiber$'));
  let fiber = fiberKey ? el[fiberKey] : null;

  while (fiber) {
    if (fiber.stateNode && predicate(fiber.stateNode)) return fiber.stateNode;
    fiber = fiber.return;
  }
  return null;
};

// [claude comment] Quill.find() falls back to returning blots, and <ReadonlyEditor/> renders a .ql-container with no Quill attached to it at all
const findLiveQuillFor = (el) => {
  const containerEl = el.closest('.ql-container');
  const found = containerEl ? Quill.find(containerEl) : null;
  return found instanceof Quill ? found : null;
};

// [claude comment] without this, a resize the user is in the middle of gets lost when the upload finishes
const moveResizeOverlay = (quill, placeholderEl, imageBlot) => {
  const resize = quill.getModule('resize');
  if (resize.activeEle === placeholderEl) {
    [resize, ...resize.modules].forEach((holder) => {
      holder.activeEle = imageBlot.domNode;
      holder.blot      = imageBlot;
    });
    imageBlot.domNode.classList.add(resize.options.activeClass);
    imageBlot.domNode.style.width = placeholderEl.style.width;
    resize.onUpdate();
  }
};

// [claude comment] saving a card mid-upload moves the placeholder into a brand new editor, which for the first instants is a readonly <Problem mode='show'/> with no Quill of its own - so keep looking for a live one for a while
const replacePlaceholderWithImage = (randomId, url, onDone, attemptsLeft = 50) => {
  const el = document.querySelector(`.placeholder-for-loading-image[data-id="${randomId}"]`);
  const liveQuill = el ? findLiveQuillFor(el) : null;

  if (!liveQuill) {
    if (el && attemptsLeft > 0) {
      setTimeout(() => replacePlaceholderWithImage(randomId, url, onDone, attemptsLeft - 1), 200);
    } else {
      onDone(null);
    }
    return;
  }

  const index = Quill.find(el).offset(liveQuill.scroll);
  const width = el.querySelector('img').getAttribute('width');
  liveQuill.updateContents(
    new Delta()
      .retain(index)
      .delete(1) // [claude comment] deletes the placeholder blot (1 delta position)
      .insert({ image: url }, width ? { width } : undefined)
  );
  moveResizeOverlay(liveQuill, el, liveQuill.getLeaf(index + 1)[0]);
  onDone(liveQuill);
};

// [claude comment] without this, a screenshot taken on a retina screen gets inserted twice as big as the area that was captured
const getWidthAsOnScreen = (img) =>
  window.devicePixelRatio > 1 && img.naturalWidth ?
    String(Math.round(img.naturalWidth / window.devicePixelRatio)) :
    null;

const placeholdAndCreateImage = (file, quill, { onSuccess = () => {}, editorComponent = null } = {}) => {
  // needed for quill.getSelection() to work
  quill.focus();
  const selectionAt = quill.getSelection() ?
    quill.getSelection().index :
    // when we are not focused on the editor (e.g. when we just drop something)
    quill.getLength();

  // => 'placeholder-624608'
  const randomId = 'placeholder-' + String(Math.floor(Math.random() * 1000000));

  // Notify editor component that upload started
  if (editorComponent && editorComponent.addPendingUpload) {
    editorComponent.addPendingUpload(randomId);
  }

  fromFileToDataUrl(file, (dataUrl) => {
    preloadImage(dataUrl, (img) => {
      quill.updateContents(
        new Delta()
          .retain(selectionAt)
          .insert({ loadingImage: { src: dataUrl, id: randomId, width: getWidthAsOnScreen(img) } })
      );

      uploadFile(false, file)
        .then((response) => response.url)
        // [claude comment] the image stays inside the flashcard as a data: url, and gets uploaded when the flashcard reaches the server (services/offline/uploadDataUrlImages.js)
        .catch((error) => {
          console.error('Image upload failed:', error);
          return dataUrl;
        })
        .then((url) => {
          preloadImage(url, () => {
            replacePlaceholderWithImage(randomId, url, (liveQuill) => {
              if (editorComponent && editorComponent.removePendingUpload) {
                editorComponent.removePendingUpload(randomId);
              }

              if (liveQuill && liveQuill !== quill) {
                // [claude comment] the new card only learns about the replaced image through a redux dispatch, so let React flush before asking its editor to save
                setTimeout(() => {
                  const newEditorComponent = findReactComponent(liveQuill.container, (instance) => instance.onBlur && instance.removePendingUpload);
                  if (newEditorComponent) { newEditorComponent.onBlur(); }
                }, 0);
              } else {
                onSuccess();
              }
            });
          });
        });
    });
  });
};

export default placeholdAndCreateImage;
