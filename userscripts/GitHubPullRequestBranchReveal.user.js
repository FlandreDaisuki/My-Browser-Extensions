// ==UserScript==
// @name        GitHub Pull Request Branch Reveal
// @description Reveal branch in GitHub pull request page
// @namespace   https://l.flandre.tw/github
// @version     1.0.1
// @match       https://github.com/*
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @require     https://unpkg.com/clipboard@2.0.11/dist/clipboard.min.js
// @icon        https://github.githubassets.com/favicons/favicon.svg
// @grant       none
// @noframes
// @author      FlandreDaisuki
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/JWTInspector/README.md
// ==/UserScript==
(function () {
  'use strict';

  const noop = () => {};
  const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

  const $el = (tag, attr = {}, cb = noop) => {
    const el = document.createElement(tag);
    if (typeof(attr) === 'string') {
      el.textContent = attr;
    }
    else {
      Object.assign(el, attr);
    }
    cb(el);
    return el;
  };

  const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

  /* global sentinel ClipboardJS */

  sentinel.on('a[data-ga-click="Repository, go to compare view, location:pull request list; text:New pull request"]', async() => {
    const issueListItemEls = Array.from($$('div[id^="issue_"]'));
    if ($$('.🐙🐱-pull-request-branches').length > 0) { return; }

    await Promise.all(
      issueListItemEls.map(async(issueListItemEl) => {
        const issueLinkEl = issueListItemEl.querySelector('a[data-hovercard-url]');
        if (!issueLinkEl) { return; }

        const hoverCardUrl = issueLinkEl.getAttribute('data-hovercard-url');
        const hoverCardHtml = await fetch(new URL(hoverCardUrl, location), {
          withCredentials: true,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
          .then((r) => r.text()).catch(console.error);
        if (!hoverCardHtml) { return; }

        const [targetBranch, sourceBranch] = hoverCardHtml.match(/(?<=span title=")[^"]+/img) ?? [];
        if (!targetBranch || !sourceBranch) { return; }

        issueLinkEl.parentElement.insertAdjacentHTML('beforeend', `
      <div class="🐙🐱-pull-request-branches">
        <code data-clipboard-text="${ targetBranch }">${ targetBranch }</code>
        <span>←</span>
        <code data-clipboard-text="${ sourceBranch }">${ sourceBranch }</code>
      </div>`);
      }),
    );

    new ClipboardJS('code[data-clipboard-text]');

    $style(`
  .🐙🐱-pull-request-branches {
    display: flex;
    align-item: center;
    gap: 0.5rem;
    padding-top: 0.25rem;

    code {
      color: var(--color-prettylights-syntax-markup-inserted-text);
      background-color: var(--color-prettylights-syntax-markup-inserted-bg);
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      user-select: none;
    }
  }`);
  });

})();
