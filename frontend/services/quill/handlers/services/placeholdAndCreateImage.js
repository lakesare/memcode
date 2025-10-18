import Delta from 'quill-delta';
import Parchment from 'parchment';
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
    const shouldSkipCompression = shiftKeyTracker.shouldSkipCompression();
    
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

window.findReactComponent = (el) => {
  for (const key in el) {
    if (key.startsWith('__reactInternalInstance$')) {
      const fiberNode = el[key];
      return fiberNode && fiberNode.return && fiberNode.return.stateNode;
    }
  }
  return null;
};

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
    quill.updateContents(
      new Delta()
        .retain(selectionAt)
        .insert({ loadingImage: { src: dataUrl, className: 'placeholder-for-loading-image', id: randomId } })
    );
    
    uploadFile(false, file)
      .then((response) => {
        preloadImage(response.url, () => {
          const placeholderEl = quill.container.querySelector(`section.placeholder-for-loading-image[data-id="${randomId}"]`);
          console.log({ placeholderEl });

          // Will be false when we save a new card, and quill container el changes.
          if (placeholderEl) {
            // Find blot
            const blot = Parchment.find(placeholderEl);
            const index = blot.offset(quill.scroll);

            quill.updateContents(
              new Delta()
                .retain(index)
                .delete(2) // delete the placeholder (I'm not sure why .delete(1) doesn't work)
                .insert({ image: response.url })
            );

            // Notify editor component that upload completed
            if (editorComponent && editorComponent.removePendingUpload) {
              editorComponent.removePendingUpload(randomId);
            }

            onSuccess();
          } else {
            const el = document.querySelector(`section.placeholder-for-loading-image[data-id="${randomId}"]`);
            const newQuillEl = el.closest('.quill');
            const newQuillReact = window.findReactComponent(newQuillEl);

            const newQuill = newQuillReact.editor;

            // Find blot
            const blot = Parchment.find(el);
            const index = blot.offset(newQuill.scroll);

            newQuill.updateContents(
              new Delta()
                .retain(index)
                .delete(2) // delete the placeholder (I'm not sure why .delete(1) doesn't work)
                .insert({ image: response.url })
            );

            // Notify editor component that upload completed (for new quill instance)
            const newEditorComponent = newQuillReact.findReactComponent && newQuillReact.findReactComponent();
            if (newEditorComponent && newEditorComponent.removePendingUpload) {
              newEditorComponent.removePendingUpload(randomId);
            } else if (editorComponent && editorComponent.removePendingUpload) {
              // Fallback to original editor component
              editorComponent.removePendingUpload(randomId);
            }

            newQuillReact.props.onBlur();
          }
        });
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
        // Notify editor component that upload failed (remove from pending)
        if (editorComponent && editorComponent.removePendingUpload) {
          editorComponent.removePendingUpload(randomId);
        }
      });
  });
};

export default placeholdAndCreateImage;
