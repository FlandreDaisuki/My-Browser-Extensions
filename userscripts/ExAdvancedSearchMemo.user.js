// ==UserScript==
// @name        ExAdvancedSearchMemo
// @description Memorize your eh search query
// @namespace   https://flandre.in/github
// @author      FlandreDaisuki
// @match       *://e-hentai.org/*
// @match       *://exhentai.org/*
// @version     1.0.3
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/ExAdvancedSearchMemo/README.md
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// ==/UserScript==
(function () {
  'use strict';

  const noop = () => {};

  /** @type {(el: HTMLElement, selectors: string) => HTMLElement[]} */
  const $findAll = (el, selectors) => Array.from(el.querySelectorAll(selectors));

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

  /** @type {(htmlText: string) => HTMLElement} */
  const $html = (htmlText) => {
    const tmpEl = $el('div');
    tmpEl.innerHTML = htmlText;
    return tmpEl.firstElementChild;
  };

  const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

  const $getValue = async(key, defaultValue) => {
    /* global globalThis */
    if (globalThis.GM_getValue) {
      return globalThis.GM_getValue(key, defaultValue);
    }
    else if (globalThis.GM.getValue){
      return globalThis.GM.getValue( key, defaultValue );
    }
  };

  const $setValue = async(key, Value) => {
    if (globalThis.GM_setValue) {
      return globalThis.GM_setValue(key, Value);
    }
    else if (globalThis.GM.setValue){
      return globalThis.GM.setValue( key, Value );
    }
  };

  const NAMESPACE = 'ExAdvancedSearchMemo';
  const load = (defaultValue = []) => $getValue(NAMESPACE, defaultValue);
  const save = (value = load()) => $setValue(NAMESPACE, value);

  (() => {
    // cSpell: disable
    // #searchbox.idi
    //   table.itc
    //   div
    //     input#f_search
    //     input(type="submit" value="Search")
    //     input(type="button" value="Clear")
    //   div
    //     a [Show Advanced Options]
    //     a [Show File Search]
    // cSpell: enable
    const inputsBoxEl = $('table.itc + div');
    if (!inputsBoxEl) { return; }
    inputsBoxEl.classList.add('🔱-input-box');

    const memoLinksEl = $html('<ul class="🔱-memo-links"></ul>');
    inputsBoxEl.insertAdjacentElement('afterend', memoLinksEl);
    const loadAllMemos = async() => {
      const allMemos = await load();
      const memoListHtmlText = allMemos
        .map((memo) => `
      <li>
        <a href="${ memo.query }">${ memo.name }</a>
        <button class="🔱-memo-edit" type="button">🖊️</button>
        <button class="🔱-memo-delete" type="button">🚮</button>
      </li>`)
        .join('');

      memoLinksEl.innerHTML = memoListHtmlText;

      const editMemo = async(event) => {
        const oldName = event.target.previousElementSibling.textContent;
        const allMemos = await load();
        const foundRenamingMemo = allMemos.find((memo) => memo.name === oldName);
        if (!foundRenamingMemo) { return; }

        // eslint-disable-next-line no-alert
        const newName = prompt('Type the new name', oldName);
        if (!newName) { return; }

        const foundTheSameNewNameMemo = allMemos.find((memo) => memo.name === newName);
        if (foundTheSameNewNameMemo) {
          foundTheSameNewNameMemo.query = foundRenamingMemo.query;
          allMemos.splice(allMemos.indexOf(foundRenamingMemo), 1);
        }
        else {
          foundRenamingMemo.name = newName;
        }
        await save(allMemos);
        await loadAllMemos();
      };
      $findAll(memoLinksEl, '.🔱-memo-edit').forEach((editEl) => {
        editEl.onclick = editMemo;
      });

      const deleteMemo = async(event) => {
        const deletingName = event.target.previousElementSibling.previousElementSibling.textContent;

        // eslint-disable-next-line no-alert
        if (!confirm(`Really delete "${ deletingName }"?`)){ return; }

        const allMemos = await load();
        await save(allMemos.filter((memo) => {
          return memo.name && memo.name !== deletingName;
        }));
        await loadAllMemos();
      };
      $findAll(memoLinksEl, '.🔱-memo-delete').forEach((deleteEl) => {
        deleteEl.onclick = deleteMemo;
      });
    };
    loadAllMemos();

    const onMemoClick = async() => {
      const query = location.search;
      // eslint-disable-next-line no-alert
      const name = prompt('Type the name');

      const allMemos = await load();
      const foundTheSameNameMemo = allMemos.find((memo) => memo.name === name);
      if (foundTheSameNameMemo) {
        foundTheSameNameMemo.query = query;
        await save(allMemos);
      }
      else {
        await save(allMemos.concat({ name, query }));
      }
      await loadAllMemos();
    };
    const memoBtnEl = $html(
      '<input type="button" class="🔱-memo-btn" value="Memo"/>',
    );
    inputsBoxEl.appendChild(memoBtnEl);
    memoBtnEl.onclick = onMemoClick;
  })();

  $style(`
.🔱-input-box {
  display: flex;
  align-items: center;
}
ul.🔱-memo-links {
  list-style: none;

  display: flex;
  flex-flow: row wrap;
  gap: 8px;
  padding: 4px;
  border: 1px dashed;
}
ul.🔱-memo-links > li {
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 8px;
}
ul.🔱-memo-links > li > a {
  margin-right: 12px;
}
ul.🔱-memo-links > li > button {
  display: inline-block;
  border: darkblue dotted 1px;
  background-color: white;
  cursor: pointer;
}
`);

})();
