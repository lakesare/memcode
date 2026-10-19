import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });

Object.getOwnPropertyNames(window)
  .filter((key) => !(key in globalThis))
  .forEach((key) => { globalThis[key] = window[key]; });

export default window;
