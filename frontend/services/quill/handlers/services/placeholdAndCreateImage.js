import Delta from 'quill-delta';

import fromFileToDataUrl from '~/services/fromFileToDataUrl';
import preloadImage from '~/services/preloadImage';
import FileApi from '~/api/FileApi';

const placeholdAndCreateImage = (quill, file) => {
  const selectionAt = quill.getSelection() ?
    quill.getSelection().index :
    // when we are not focused on the editor (e.g. when we just drop something)
    quill.getLength();

  fromFileToDataUrl(file, (dataUrl) => {
    quill.updateContents(
      new Delta()
        .retain(selectionAt)
        .insert({ loadingImage: { src: dataUrl, className: 'placeholder-for-loading-image' } })
    );
    FileApi.upload(false, file)
      .then((response) => {
        preloadImage(response.url, () => {
          quill.updateContents(
            new Delta()
              .retain(selectionAt)
              .delete(2) // delete the placeholder
              .insert({ image: response.url })
          );
        });
      });
  });
};

export default placeholdAndCreateImage;
