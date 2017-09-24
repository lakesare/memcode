import { Quill } from 'react-quill';

import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);
