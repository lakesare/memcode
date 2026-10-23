import JSZip from 'jszip';

// [claude comment] every epub is laid out into fixed A5-sized pages (CSS px), so bookmarks and highlights stored as page + fraction stay where they were
const PAGE_WIDTH = 560;
const PAGE_HEIGHT = 794;
const MARGIN_X = 44;
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 54;
const COLUMN_WIDTH = PAGE_WIDTH - 2 * MARGIN_X;
const COLUMN_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
const COLUMN_GAP = 2 * MARGIN_X + 40;
const COLUMN_STEP = COLUMN_WIDTH + COLUMN_GAP;

const XHTML = 'http://www.w3.org/1999/xhtml';
const XLINK = 'http://www.w3.org/1999/xlink';
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const MEDIA_TYPES = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', bmp: 'image/bmp',
  ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2', css: 'text/css'
};

const SUBSET_TESTS = {
  'latin-ext': /[\u0100-\u02ff\u1e00-\u1eff]/,
  greek:       /[\u0370-\u03ff]/,
  cyrillic:    /[\u0400-\u045f\u0490-\u04b1]/
};

const BASE_CSS = `
  html{ margin: 0 !important; padding: ${MARGIN_TOP}px ${MARGIN_X}px 0 !important; width: ${PAGE_WIDTH}px !important; height: ${PAGE_HEIGHT}px !important; box-sizing: border-box !important; background: #fff; color: #000; font-family: 'Epub Serif'; }
  body{ font-family: 'Epub Serif'; line-height: 1.45; }
  img, svg, video{ max-width: 100%; max-height: ${COLUMN_HEIGHT}px; break-inside: avoid; }
  img{ height: auto; object-fit: contain; }
  pre{ white-space: pre-wrap; }
  table{ max-width: 100%; }
`;

// [claude comment] appended after the book's own css, so the book can't move the page box
const PAGE_CSS = `
  *{ hyphens: manual !important; -webkit-hyphens: manual !important; }
  body{ margin: 0 !important; padding: 0 !important; width: ${COLUMN_WIDTH}px !important; max-width: none !important; height: ${COLUMN_HEIGHT}px !important; min-height: 0 !important; max-height: none !important; columns: ${COLUMN_WIDTH}px auto !important; column-gap: ${COLUMN_GAP}px !important; column-fill: auto !important; overflow: visible !important; position: relative !important; }
`;

const extensionOf = (filePath) => filePath.split('.').pop().toLowerCase();

const resolvePath = (base, relative) => {
  const clean = decodeURIComponent(relative.split('#')[0].split('?')[0]);
  if (!clean) return base;
  const parts = clean.startsWith('/') ? [] : base.split('/').slice(0, -1);
  clean.split('/').forEach((part) => {
    if (part === '..') { parts.pop(); } else if (part !== '.' && part !== '') { parts.push(part); }
  });
  return parts.join('/');
};

const bytesToBase64 = (bytes) => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};

const escapeCdata = (css) => css.replace(/]]>/g, ']] >');

let bundledFontsPromise = null;
const getBundledFonts = () => {
  if (!bundledFontsPromise) {
    bundledFontsPromise = (async () => {
      const faces = await (await fetch('/epub-fonts/fonts.json')).json();
      return Promise.all(faces.map(async (face) => {
        const bytes = new Uint8Array(await (await fetch(`/epub-fonts/${face.file}`)).arrayBuffer());
        return {
          subset: face.subset,
          css:    `@font-face{ font-family: '${face.family}'; font-style: ${face.style}; font-weight: ${face.weight}; unicode-range: ${face.unicodeRange}; src: url(data:font/woff2;base64,${bytesToBase64(bytes)}) format('woff2'); }`
        };
      }));
    })();
    bundledFontsPromise.catch(() => { bundledFontsPromise = null; });
  }
  return bundledFontsPromise;
};

const genericFamilyOf = (name) => {
  const lower = name.toLowerCase();
  if (/mono|courier|consol|code|menlo|typewriter/.test(lower)) {
    return 'Epub Mono';
  } else if (/sans|arial|helvetica|verdana|tahoma|gothic|calibri|segoe|roboto|open/.test(lower) && lower !== 'serif') {
    return 'Epub Sans';
  } else {
    return 'Epub Serif';
  }
};

// [claude comment] keeps the fonts the book brings, every other family becomes one of the bundled fonts - system fonts differ between devices and would paginate the book differently
const remapFamilies = (value, embeddedFamilies) => {
  const names = value.split(',').map((name) => name.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  const kept = names.filter((name) => embeddedFamilies.has(name.toLowerCase()));
  const fallback = genericFamilyOf(names.find((name) => !embeddedFamilies.has(name.toLowerCase())) || 'serif');
  return [...kept.map((name) => `'${name.replace(/'/g, '')}'`), `'${fallback}'`].join(', ');
};

// [claude comment] also turns page breaks into column breaks - every page here is one column, and a page break means nothing inside columns
const remapCss = (css, embeddedFamilies) => {
  const parts = css.split(/(@font-face\s*{[^}]*})/i);
  return parts.map((part) => (
    /^@font-face/i.test(part) ?
      part :
      part
        .replace(/font-family\s*:\s*([^;}!]+)/gi, (_, value) => `font-family: ${remapFamilies(value, embeddedFamilies)}`)
        .replace(/page-break-(before|after)\s*:\s*(always|left|right)/gi, 'break-$1: column')
        .replace(/(^|[^-])break-(before|after)\s*:\s*(page|left|right|recto|verso)/gi, '$1break-$2: column')
  )).join('');
};

const createEpubBook = async (bytes) => {
  const zip = await JSZip.loadAsync(bytes);
  const readText = (filePath) => {
    const file = zip.file(filePath);
    return file ? file.async('string') : Promise.resolve(null);
  };

  const dataUrls = {};
  const dataUrlOf = (filePath) => {
    if (!dataUrls[filePath]) {
      const file = zip.file(filePath);
      dataUrls[filePath] = file ?
        file.async('base64').then((base64) => `data:${MEDIA_TYPES[extensionOf(filePath)] || 'application/octet-stream'};base64,${base64}`) :
        Promise.resolve(EMPTY_IMAGE);
    }
    return dataUrls[filePath];
  };

  const inlineCssUrls = async (css, cssPath) => {
    const urls = [...new Set([...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)].map((match) => match[1]))]
      .filter((url) => !/^(data|https?):/i.test(url));
    const replacements = await Promise.all(urls.map((url) => dataUrlOf(resolvePath(cssPath, url))));
    let result = css.replace(/@import[^;]+;/gi, '');
    urls.forEach((url, i) => { result = result.split(url).join(replacements[i]); });
    return result;
  };

  const container = await readText('META-INF/container.xml');
  const opfPath = container && (container.match(/full-path\s*=\s*["']([^"']+)["']/) || [])[1];
  const opfText = opfPath && await readText(opfPath);
  if (!opfText) throw new Error("This epub has no readable list of chapters");
  const opf = new DOMParser().parseFromString(opfText, 'application/xml');
  const manifest = {};
  Array.from(opf.getElementsByTagNameNS('*', 'item')).forEach((item) => {
    manifest[item.getAttribute('id')] = { path: resolvePath(opfPath, item.getAttribute('href')), mediaType: item.getAttribute('media-type') || '' };
  });
  const chapterPaths = Array.from(opf.getElementsByTagNameNS('*', 'itemref'))
    .map((itemref) => manifest[itemref.getAttribute('idref')])
    .filter((item) => item && /html|xml/.test(item.mediaType + item.path))
    .map((item) => item.path);

  const cssCache = {};
  const cssOf = (cssPath) => {
    if (!cssCache[cssPath]) cssCache[cssPath] = readText(cssPath).then((css) => (css ? inlineCssUrls(css, cssPath) : ''));
    return cssCache[cssPath];
  };

  // [claude comment] a chapter becomes a template: its css, and its body as xhtml with every image's address left out, so a page can be drawn with only its own images decoded
  const buildChapter = async (chapterPath) => {
    const text = await readText(chapterPath);
    if (!text) return null;
    let doc = new DOMParser().parseFromString(text, 'application/xhtml+xml');
    if (doc.getElementsByTagName('parsererror').length) doc = new DOMParser().parseFromString(text, 'text/html');
    const body = doc.getElementsByTagName('body')[0];
    if (!body) return null;

    const cssParts = [];
    for (const element of Array.from(doc.querySelectorAll('link, style'))) {
      if (element.localName === 'link') {
        if (/stylesheet/i.test(element.getAttribute('rel') || '') && element.getAttribute('href')) cssParts.push(await cssOf(resolvePath(chapterPath, element.getAttribute('href'))));
      } else {
        cssParts.push(await inlineCssUrls(element.textContent, chapterPath));
      }
    }
    let css = cssParts.join('\n');
    const embeddedFamilies = new Set([...css.matchAll(/@font-face\s*{[^}]*font-family\s*:\s*['"]?([^;'"}]+)/gi)].map((match) => match[1].trim().toLowerCase()));
    css = remapCss(css, embeddedFamilies);

    body.querySelectorAll('script, iframe, object, embed, audio, video source').forEach((element) => element.remove());
    const images = [];
    for (const element of Array.from(body.querySelectorAll('*'))) {
      for (const attribute of Array.from(element.attributes)) {
        if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
      }
      const style = element.getAttribute('style');
      if (style && /font-family|break/i.test(style)) element.setAttribute('style', remapCss(style, embeddedFamilies));
      if (element.localName === 'a') element.removeAttribute('href');

      const srcAttribute = element.localName === 'img' ? 'src' : (element.localName === 'image' ? (element.hasAttributeNS(XLINK, 'href') ? 'xlink:href' : 'href') : null);
      const src = srcAttribute && element.getAttribute(srcAttribute);
      if (src) {
        const index = images.length;
        images.push(/^data:/i.test(src) ? Promise.resolve(src) : dataUrlOf(resolvePath(chapterPath, src)));
        element.setAttribute('data-epub-image', String(index));
        if (srcAttribute === 'xlink:href') {
          element.setAttributeNS(XLINK, 'xlink:href', `epub-image-${index}`);
        } else {
          element.setAttribute(srcAttribute, `epub-image-${index}`);
        }
      }
    }

    const serializer = new XMLSerializer();
    const content = Array.from(body.childNodes).map((node) => serializer.serializeToString(node)).join('');
    const attributesOf = (element) => ['class', 'lang', 'dir', 'xml:lang']
      .filter((name) => element && element.getAttribute(name))
      .map((name) => ` ${name}="${element.getAttribute(name).replace(/"/g, '&quot;')}"`).join('');
    const subsets = ['latin', ...Object.keys(SUBSET_TESTS).filter((subset) => SUBSET_TESTS[subset].test(body.textContent))];
    return {
      css, content, subsets,
      htmlAttributes: attributesOf(doc.documentElement),
      bodyAttributes: attributesOf(body),
      imageUrls:      await Promise.all(images)
    };
  };

  // [claude comment] the same svg document is used to measure a chapter (in an iframe) and to draw its pages (as an image), so both see exactly the same layout
  // [claude comment] no viewBox at scale 1: an svg shown in an iframe is otherwise shrunk to fit the iframe, and the measurements with it
  const contentOf = (chapter, imagesShown = null) =>
    chapter.content.replace(/epub-image-(\d+)/g, (_, index) =>
      (!imagesShown || imagesShown.has(Number(index)) ? chapter.imageUrls[index] : EMPTY_IMAGE)
    );

  const cssOfChapter = async (chapter) => {
    const fonts = (await getBundledFonts()).filter((face) => chapter.subsets.includes(face.subset)).map((face) => face.css).join('\n');
    return `${fonts}\n${BASE_CSS}\n${chapter.css}\n${PAGE_CSS}`;
  };

  const svgOf = async (chapter, { columnIndex = 0, scale = 1, imagesShown = null } = {}) => {
    const hiddenImageSizes = imagesShown && chapter.imageSizes ?
      chapter.imageSizes.map((size, index) => (imagesShown.has(index) || !size ? '' : `[data-epub-image="${index}"]{ width: ${size[0]}px !important; height: ${size[1]}px !important; }`)).join('\n') :
      '';
    const content = contentOf(chapter, imagesShown);
    const css = `${await cssOfChapter(chapter)}\n${hiddenImageSizes}\nbody{ transform: translateX(${-columnIndex * COLUMN_STEP}px) !important; }`;
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="${XLINK}" width="${PAGE_WIDTH * scale}" height="${PAGE_HEIGHT * scale}"${scale === 1 ? '' : ` viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}"`}>` +
      `<foreignObject x="0" y="0" width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}">` +
      `<html xmlns="${XHTML}"${chapter.htmlAttributes}><head><style><![CDATA[${escapeCdata(css)}]]></style></head>` +
      `<body${chapter.bodyAttributes}>${content}</body></html>` +
      '</foreignObject></svg>';
  };

  return { zip, chapterPaths, buildChapter, svgOf, contentOf, cssOfChapter };
};

const textItemsOfLayout = (doc, body) => {
  const bodyRect = body.getBoundingClientRect();
  const pageOf = (rect) => Math.max(0, Math.floor((rect.left - bodyRect.left + COLUMN_GAP / 2) / COLUMN_STEP));
  const items = [];
  const push = (rect, str, fontSize) => {
    const page = pageOf(rect);
    const x = rect.left - page * COLUMN_STEP;
    const yCenter = rect.top + rect.height * 0.55;
    items.push({ page, str, x, width: rect.width, baseline: yCenter + fontSize * 0.32, fontSize });
  };
  const range = doc.createRange();
  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue;
    if (!text.trim() || !node.parentElement) continue;
    const fontSize = parseFloat(doc.defaultView.getComputedStyle(node.parentElement).fontSize) || 16;
    range.selectNodeContents(node);
    const nodeRects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    if (nodeRects.length === 0) continue;
    if (nodeRects.length === 1) {
      push(nodeRects[0], text.replace(/\s+/g, ' ').trim(), fontSize);
      continue;
    }
    // [claude comment] a text node over several lines is split word by word, then the words on one line are joined back into one item
    let line = null;
    const flush = () => {
      if (line) push(line.rect, text.slice(line.start, line.end).replace(/\s+/g, ' ').trim(), fontSize);
      line = null;
    };
    for (const match of text.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
      if (rects.length === 0) continue;
      const rect = rects[0];
      if (line && Math.abs(rect.top - line.rect.top) < fontSize * 0.5 && pageOf(rect) === pageOf(line.rect)) {
        const left = Math.min(line.rect.left, rect.left);
        const right = Math.max(line.rect.right, rect.right);
        line.rect = { left, right, top: line.rect.top, bottom: line.rect.bottom, width: right - left, height: line.rect.height };
        line.end = match.index + match[0].length;
      } else {
        flush();
        line = { rect, start: match.index, end: match.index + match[0].length };
      }
      if (rects.length > 1) {
        flush();
        rects.slice(1).forEach((extra) => push(extra, '', fontSize));
      }
    }
    flush();
  }
  return items.filter((item) => item.str);
};

// [claude comment] lays a chapter out in a hidden iframe: how many pages it takes, where its text is, and which images are on which page
// [claude comment] chapters with the same css reuse the loaded document and only swap the body - loading a book's embedded fonts again for every chapter is what takes time
const measureChapter = async (book, chapter, iframe) => {
  const documentKey = `${chapter.subsets.join()}|${chapter.htmlAttributes}|${chapter.css}`;
  if (iframe.documentKey === documentKey && iframe.contentDocument) {
    const doc = iframe.contentDocument;
    const body = doc.getElementsByTagNameNS(XHTML, 'body')[0];
    Array.from(body.attributes).forEach((attribute) => body.removeAttribute(attribute.name));
    const holder = new DOMParser().parseFromString(`<body xmlns="${XHTML}" xmlns:xlink="${XLINK}"${chapter.bodyAttributes}>${book.contentOf(chapter)}</body>`, 'application/xml').documentElement;
    Array.from(holder.attributes).filter((attribute) => !attribute.name.startsWith('xmlns')).forEach((attribute) => body.setAttribute(attribute.name, attribute.value));
    body.replaceChildren(...Array.from(holder.childNodes).map((node) => doc.importNode(node, true)));
  } else {
    const url = URL.createObjectURL(new Blob([await book.svgOf(chapter)], { type: 'image/svg+xml' }));
    try {
      await new Promise((resolve, reject) => {
        iframe.onload = resolve;
        iframe.onerror = reject;
        iframe.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
    iframe.documentKey = documentKey;
  }
  {
    const doc = iframe.contentDocument;
    // [claude comment] fonts only start loading once the text is laid out, so measuring right after load would see the fallback font
    doc.documentElement.getBoundingClientRect();
    if (doc.fonts) {
      await Promise.all(Array.from(doc.fonts).filter((face) => face.status !== 'loaded').map((face) => face.load().catch(() => null)));
      await doc.fonts.ready;
    }
    await Promise.all(Array.from(doc.getElementsByTagNameNS(XHTML, 'img')).map((img) => (img.decode ? img.decode().catch(() => null) : null)));
    const body = doc.getElementsByTagNameNS(XHTML, 'body')[0];
    const bodyRect = body.getBoundingClientRect();
    const pageOf = (rect) => Math.max(0, Math.floor((rect.left - bodyRect.left + COLUMN_GAP / 2) / COLUMN_STEP));

    const items = textItemsOfLayout(doc, body);
    const imagePages = chapter.imageUrls.map(() => new Set());
    const imageSizes = chapter.imageUrls.map(() => null);
    doc.querySelectorAll('[data-epub-image]').forEach((element) => {
      const index = Number(element.getAttribute('data-epub-image'));
      const rect = element.getBoundingClientRect();
      if (element.localName === 'img') imageSizes[index] = [rect.width, rect.height];
      Array.from(element.getClientRects()).forEach((part) => {
        for (let page = pageOf({ left: part.left }); page <= pageOf({ left: part.right - 1 }); page++) imagePages[index].add(page);
      });
    });
    const lastPageWithContent = Math.max(0, ...items.map((item) => item.page), ...imagePages.flatMap((pages) => [...pages]));
    const nOfColumns = Math.max(1, Math.round((body.scrollWidth + COLUMN_GAP) / COLUMN_STEP));
    const round = (number) => Math.round(number * 100) / 100;
    return {
      nOfPages:   Math.min(nOfColumns, lastPageWithContent + 1),
      items:      items.map((item) => ({ ...item, x: round(item.x), width: round(item.width), baseline: round(item.baseline), fontSize: round(item.fontSize) })),
      imagePages: imagePages.map((pages) => [...pages]),
      imageSizes
    };
  }
};

const transformOf = (m1, m2) => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
];

// [claude comment] the subset of pdf.js the reader uses (Util.transform), for books that aren't pdfs
const pdfjsLike = { Util: { transform: transformOf } };

const viewportOf = (scale) => ({
  width:     PAGE_WIDTH * scale,
  height:    PAGE_HEIGHT * scale,
  scale,
  transform: [scale, 0, 0, -scale, 0, PAGE_HEIGHT * scale]
});

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Could not draw this page of the epub'));
  img.src = url;
});

// [claude comment] returns the same shape as loadPdf: an object that answers numPages/getPage like a pdf.js document, with each page drawn from the laid-out epub
const LAYOUT_CACHE = 'epub_layouts_v1';
const LAYOUT_VERSION = 1;

// [claude comment] measuring a book takes seconds, so each device keeps its measurements - Chrome and Firefox lay text out slightly differently, so the browser engine is part of the key
const layoutUrlOf = (cacheKey) => `/epub-layouts/${cacheKey}/${LAYOUT_VERSION}/${/firefox/i.test(navigator.userAgent) ? 'gecko' : 'blink'}`;

const readCachedLayouts = async (cacheKey) => {
  try {
    const cache = await caches.open(LAYOUT_CACHE);
    const response = await cache.match(layoutUrlOf(cacheKey));
    return response ? await response.json() : null;
  } catch {
    return null;
  }
};

const writeCachedLayouts = async (cacheKey, layouts) => {
  try {
    const cache = await caches.open(LAYOUT_CACHE);
    await cache.put(layoutUrlOf(cacheKey), new Response(JSON.stringify(layouts), { headers: { 'Content-Type': 'application/json' } }));
  } catch {
    // [claude comment] without the cache the book is measured again next time
  }
};

const forgetEpubLayouts = async (cacheKey) => {
  try {
    const cache = await caches.open(LAYOUT_CACHE);
    const keys = await cache.keys();
    await Promise.all(keys.filter((request) => new URL(request.url).pathname.startsWith(`/epub-layouts/${cacheKey}/`)).map((request) => cache.delete(request)));
  } catch {
    // [claude comment] nothing cached
  }
};

const loadEpub = async (bytes, onProgress, cacheKey) => {
  const book = await createEpubBook(bytes);
  const cachedLayouts = cacheKey ? await readCachedLayouts(cacheKey) : null;
  const layouts = [];
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.cssText = `position: fixed; left: -${PAGE_WIDTH * 4}px; top: 0; width: ${PAGE_WIDTH + 100}px; height: ${PAGE_HEIGHT + 100}px; border: 0; opacity: 0; pointer-events: none;`;
  document.body.appendChild(iframe);

  const chapters = [];
  const pages = [];
  try {
    for (let i = 0; i < book.chapterPaths.length; i++) {
      const chapter = await book.buildChapter(book.chapterPaths[i]);
      if (chapter) {
        const cached = cachedLayouts && cachedLayouts[chapters.length];
        const layout = cached && cached.contentLength === chapter.content.length ?
          cached :
          { ...await measureChapter(book, chapter, iframe), contentLength: chapter.content.length };
        layouts.push(layout);
        chapter.imageSizes = layout.imageSizes;
        chapter.imagePages = layout.imagePages;
        const firstPage = pages.length;
        for (let column = 0; column < layout.nOfPages; column++) {
          pages.push({ chapterIndex: chapters.length, column, items: layout.items.filter((item) => item.page === column) });
        }
        chapter.firstPage = firstPage;
        chapters.push(chapter);
      }
      if (onProgress) onProgress(i + 1, book.chapterPaths.length);
    }
  } finally {
    iframe.remove();
  }
  if (pages.length === 0) throw new Error('This epub has no pages');
  if (cacheKey && !(cachedLayouts && layouts.every((layout, i) => layout === cachedLayouts[i]))) writeCachedLayouts(cacheKey, layouts);

  const pageObjects = {};
  const getPage = (pageNumber) => {
    const page = pages[pageNumber - 1];
    if (!page) return Promise.reject(new Error(`No page ${pageNumber}`));
    if (!pageObjects[pageNumber]) {
      const chapter = chapters[page.chapterIndex];
      pageObjects[pageNumber] = {
        getViewport: ({ scale }) => viewportOf(scale),
        getTextContent: () => Promise.resolve({
          items: page.items.map((item) => ({
            str:       item.str,
            width:     item.width,
            height:    item.fontSize,
            transform: [item.fontSize, 0, 0, item.fontSize, item.x, PAGE_HEIGHT - item.baseline]
          }))
        }),
        render: ({ canvasContext, viewport, transform }) => {
          let cancelled = false;
          const promise = (async () => {
            const imagesShown = new Set(chapter.imagePages.map((pagesOfImage, index) => (pagesOfImage.includes(page.column) ? index : -1)).filter((index) => index >= 0));
            const svg = await book.svgOf(chapter, { columnIndex: page.column, scale: viewport.scale, imagesShown });
            if (cancelled) throw Object.assign(new Error('Rendering cancelled'), { name: 'RenderingCancelledException' });
            // [claude comment] a data: url, not a blob: one - Chrome taints the canvas for an svg image with html inside it loaded from a blob
            const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            {
              const img = await loadImage(url);
              if (cancelled) throw Object.assign(new Error('Rendering cancelled'), { name: 'RenderingCancelledException' });
              canvasContext.save();
              if (transform) canvasContext.transform(...transform);
              canvasContext.fillStyle = '#fff';
              canvasContext.fillRect(0, 0, viewport.width, viewport.height);
              canvasContext.drawImage(img, 0, 0, viewport.width, viewport.height);
              canvasContext.restore();
            }
          })();
          return { promise, cancel: () => { cancelled = true; } };
        },
        cleanup: () => {}
      };
    }
    return Promise.resolve(pageObjects[pageNumber]);
  };

  const pdfDocument = { numPages: pages.length, getPage };
  const pageSizes = pages.map(() => ({ width: PAGE_WIDTH, height: PAGE_HEIGHT }));
  return { pdfjs: pdfjsLike, pdfDocument, pageSizes, loadingTask: { destroy: () => {} } };
};

// [claude comment] the title the book gives itself, nicer than file names like "Author - Title (2019, Publisher) - libgen.li.epub"
const epubTitleOf = async (file) => {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const container = await zip.file('META-INF/container.xml')?.async('string');
  const opfPath = container && (container.match(/full-path\s*=\s*["']([^"']+)["']/) || [])[1];
  const opfText = opfPath && await zip.file(opfPath)?.async('string');
  const opf = opfText && new DOMParser().parseFromString(opfText, 'application/xml');
  const title = opf && opf.getElementsByTagNameNS('*', 'title')[0];
  return title && title.textContent.trim() ? title.textContent.trim() : null;
};

export { loadEpub, forgetEpubLayouts, epubTitleOf };
export default loadEpub;
