export const noop = () => {};

/** @type {(el: HTMLElement, selectors: string) => HTMLElement | null} */
export const $find = (el, selectors) => el.querySelector(selectors);

/** @type {(el: HTMLElement, selectors: string) => HTMLElement[]} */
export const $findAll = (el, selectors) => Array.from(el.querySelectorAll(selectors));

/** @type {(selectors: string) => HTMLElement | null} */
export const $ = (selectors) => document.querySelector(selectors);

/** @type {(selectors: string) => HTMLElement[]} */
export const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

/** @type {(tag: string, attr: Record<string, unknown>, cb: (el: HTMLElement) => void) => HTMLElement} */
export const $el = (tag, attr = {}, cb = noop) => {
  const el = document.createElement(tag);
  if (typeof (attr) === 'string') {
    el.textContent = attr;
  }
  else {
    Object.assign(el, attr);
  }
  cb(el);
  return el;
};

/** @type {(htmlText: string) => HTMLElement} */
export const $html = (htmlText) => {
  const tmpEl = $el('div');
  tmpEl.innerHTML = htmlText;
  return tmpEl.firstElementChild;
};

export const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

export const $getValue = async(key, defaultValue) => {
  /* global globalThis */
  if (globalThis.GM_getValue) {
    return globalThis.GM_getValue(key, defaultValue);
  }
  else if (globalThis.GM.getValue){
    return globalThis.GM.getValue( key, defaultValue );
  }
};

export const $setValue = async(key, Value) => {
  if (globalThis.GM_setValue) {
    return globalThis.GM_setValue(key, Value);
  }
  else if (globalThis.GM.setValue){
    return globalThis.GM.setValue( key, Value );
  }
};

export const $getResourceText = (key) => {
  if (globalThis.GM_getResourceText) {
    return globalThis.GM_getResourceText(key);
  }
  else if (globalThis.GM.getResourceText){
    return globalThis.GM.getResourceText( key );
  }
};
