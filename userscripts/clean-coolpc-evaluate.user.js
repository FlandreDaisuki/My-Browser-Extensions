// ==UserScript==
// @name         乾淨ㄉ原價屋
// @namespace    https://github.com/FlandreDaisuki
// @description  讓我好好的選零件…
// @version      0.1
// @author       FlandreDaisuki
// @match        http://www.coolpc.com.tw/evaluate.php
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @noiframes
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

// 推薦搭配 AdGuard Annoyances 過濾清單

const noop = () => {};
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const removeEl = (el) => { el.remove(); }

unsafeWindow.getData = noop;
unsafeWindow.SkipMsg = () => unsafeWindow.Gauze(2);

unsafeWindow._ViewPro = unsafeWindow.ViewPro;
unsafeWindow.ViewPro = (a, b) => {
  if(!a) { return alert('請先【產生擷取檔】'); }
  if(!b) { open(a); }
  unsafeWindow._ViewPro(a, b);
}

document.body.removeAttribute('oncontextmenu');
document.body.removeAttribute('onselectstart');
document.body.removeAttribute('onkeyup');

// 上廣告
const ad = $('img[src*="/ad"]');
if(ad) {
  ad.closest('table').remove();
}

// iframe
sentinel.on('iframe:not([src="eval-save.php"])', removeEl);
