// ==UserScript==
// @name        乾淨ㄉ原價屋
// @description 讓我好好的選零件…
// @namespace   https://flandre.in/github
// @version     2022.11.13
// @match       https://coolpc.com.tw/evaluate.php
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant       none
// @noframes
// @author      FlandreDaisuki
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/CleanCoolpcEvaluate/README.md
// @license     MIT
// ==/UserScript==
(function () {
  'use strict';

  const noop = () => {};

  /** @type {(selectors: string) => HTMLElement | null} */
  const $ = (selectors) => document.querySelector(selectors);

  /** @type {(tag: string, attr: Record<string, unknown>, cb: (el: HTMLElement) => void) => HTMLElement} */
  const $el = (tag, attr = {}, cb = noop) => {
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

  const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

  // 推薦搭配 AdGuard Annoyances 過濾清單

  /* cSpell:ignore vwpro mesg Ttitle Fitem */
  /* global sentinel */

  // 取消鎖右鍵
  document.body.removeAttribute('oncontextmenu');
  document.body.removeAttribute('onselectstart');

  // 總金額預覽移到上面
  sentinel.on('#fDiv', (floatingBar) => {
    sentinel.off('#fDiv');
    floatingBar.remove();
    $('#know').insertAdjacentElement('afterend', floatingBar);
  });

  // 保留輸出圖片功能
  sentinel.on('#vwpro', () => {
    $('#doc').classList.add('zTop');
  });

  sentinel.on('button[onclick="Gauze(2)"]', (imageExportCancelBtnEl) => {
    sentinel.off('button[onclick="Gauze(2)"]');
    imageExportCancelBtnEl.addEventListener('click', () => {
      $('#doc').classList.remove('zTop');
    });
  });

  // 刪除無用的 iframe
  const iframeSelectors = [
    'iframe[src^="/home"]',
    'iframe[src$="eval-mesg.php"]',
  ];

  sentinel.on(String(iframeSelectors), (iframe) => {
    iframe.remove();
  });

  // 調整樣式
  $style(`
body {
  overflow: auto !important;
}
#Psu,
#hid,
#Ttitle > tbody > tr:nth-of-type(1) > td:nth-of-type(2),
#Ttitle > tbody > tr:nth-of-type(2) {
  display: none !important;
}
#doc {
  z-index: -1 !important;
}
form[action="eva-excel.php"] {
  position: relative;
}
#Ttitle > tbody > tr:first-of-type > td:first-of-type {
  display: grid;
  grid-template-columns: repeat(2, auto);
}
#fDiv {
  position: relative;
  display: flex;
  transform: initial;
  left: inherit !important
}
#ftb {
  margin: 0;
  border: 2px solid black;
}
#Fitem {
  position: relative !important;
}
#doc.zTop {
  z-index: 20 !important;
  background: rgba(0, 0, 0, 0.8);
}
#MatchArea {
  position: absolute;
  top: 100%;
}`);

})();
