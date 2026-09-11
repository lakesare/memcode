import Quill from 'quill';

import ImageResize from 'quill-resize-module';
Quill.register('modules/resize', ImageResize);

import moduleDropOrPasteImage from './moduleDropOrPasteImage';
Quill.register('modules/moduleDropOrPasteImage', moduleDropOrPasteImage);
