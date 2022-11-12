export const noop = () => {};

export const $find = (el, selectors) => el.querySelector(selectors);
export const $findAll = (el, selectors) => Array.from(el.querySelectorAll(selectors));
export const $ = (selectors) => document.querySelector(selectors);
export const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

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

export const $html = (htmlText) => {
  const tmpEl = $el('div');
  tmpEl.innerHTML = htmlText;
  return tmpEl.firstElementChild;
};

export const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

export const $getValue = async(key, defaultValue) => {
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

export const $xhr = (details) => {
  const xhrFn = globalThis.GM_xmlhttpRequest ?? GM.xmlhttpRequest;
  return xhrFn(details);
};
