import Delta from 'quill-delta';

import fromFileToDataUrl from '~/services/fromFileToDataUrl';

const insertImageWithDataUrlSrc = (quill, file) => {
  const selectionAt = quill.getSelection() ?
    quill.getSelection().index :
    // when we are not focused on the editor (e.g. when we just drop something)
    quill.getLength();

  fromFileToDataUrl(file, (dataUrl) => {
    quill.updateContents(
      new Delta()
        .retain(selectionAt)
        .insert({ image: dataUrl })
    );
  });
};

export default insertImageWithDataUrlSrc;
