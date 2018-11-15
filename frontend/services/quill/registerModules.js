import { Quill } from 'react-quill';

import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

import moduleDropOrPasteImage from './moduleDropOrPasteImage';
Quill.register('modules/moduleDropOrPasteImage', moduleDropOrPasteImage);
