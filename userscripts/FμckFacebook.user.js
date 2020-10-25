// ==UserScript==
// @name         Fμck Facebook
// @namespace    https://github.com/FlandreDaisuki
// @version      1.0.0
// @description  Remove all Facebook shit
// @author       FlandreDaisuki
// @match        https://*.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// ==/UserScript==

/*
推薦與以下樣式一起使用，效果更佳
https://github.com/FlandreDaisuki/My-Browser-Extensions/tree/master/usercss#facebullshit
*/

/* global sentinel */
const noop = () => {};
const $ = (s) => document.querySelector(s);
const $el = (tag, attrs = {}, callback = noop) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  callback(el);
  return el;
};

const DEFAULT_CONF = {
  NO_SPONSORS: 1,
  NO_FRIEND_RECOMMENDATION: 1,
  CHANGE_LOGO_LINK: 1,
};

const saveConf = (conf) => localStorage.setItem('🖕📘', JSON.stringify(conf));
const loadConf = () => {
  const config = JSON.parse(localStorage.getItem('🖕📘'));
  if (!config) {
    saveConf(DEFAULT_CONF);
    return loadConf();
  }
  return config;
};

const config = loadConf();

/* Feature 1: 刪掉贊助 */
const sponsorFeedsRules = [
  '[href="#"] > span > b',
  'span[id^="jsc"] > span + div',
];

sentinel.on(sponsorFeedsRules.join(','), (sponsorEl) => {
  const feedRootEl = sponsorEl.closest('[data-pagelet^="FeedUnit_"]');
  if (feedRootEl && config.NO_SPONSORS) {
    feedRootEl.hidden = true;
  }
});

/* Feature 2: 刪掉你可能認識誰誰誰 */
const recommendFriendRules = [
  'div:empty + div.j83agx80.l9j0dhe7.k4urcfbm',
];

sentinel.on(recommendFriendRules.join(','), (recommendFriendEl) => {
  const feedRootEl = recommendFriendEl.closest('[data-pagelet^="FeedUnit_"]');
  if (feedRootEl && config.NO_FRIEND_RECOMMENDATION) {
    feedRootEl.hidden = true;
  }
});

/* Feature 3: 按左上 Logo 以時間排序而非推薦系統 */
window.customElements.define('alt-facebook-logo', class extends HTMLElement {
  constructor() {
    super();
    this._orderBy = 'time'
    this.onclick = () => location.href = this.href;
  }
  connectedCallback() {
    this.orderBy = this.getAttribute('order-by').toLocaleLowerCase();
    this.style.cursor = 'pointer';
  }
  get href() {
    return this.orderByUpdate ? 'https://www.facebook.com/?sk=h_chr' : 'https://www.facebook.com/'
  }
  get orderByUpdate() {
    return this._orderBy === 'time';
  }
  get orderBy() {
    return this._orderBy;
  }
  set orderBy(v) {
    if(String(v).toLocaleLowerCase() === 'time') {
      this._orderBy = 'time';
      this.title = '依時間排序';
    } else {
      this._orderBy = 'algo';
      this.title = '依演算法排序';
    }
  }
});

const newLogoEl = $el('alt-facebook-logo', {
  'id': '🖕📘-logo',
  'order-by': config.CHANGE_LOGO_LINK ? 'time' : 'algo',
  'tabindex': 0,
});

sentinel.on('[role="banner"] a[aria-label="Facebook"]:not([href="https://www.facebook.com/?sk=h_chr"])', (oldLogoEl) => {
  oldLogoEl.replaceWith(newLogoEl);
});

/* Feature 4: 以上皆可個別設定 */
const confOverlayEl = $el('div', {
  id: '🖕📘⚙️🌃',
  hidden: true,
}, (el) => {
  document.body.appendChild(el);
  el.addEventListener('click', (event) => {
    event.stopPropagation();
    confOverlayEl.hidden = true;
  });
  el.innerHTML = `
<div class="flex align-center justify-center min-w-100p min-h-100vh">
  <div id="🖕📘⚙️-root" class="flex flex-column no-outline overflow-hidden pos-r z0 bgc-card br-8 dialog-border w-100p" role="dialog" style="max-width: 548px; height: 260px;">
    <div class="pos-a w-100p" style="transform: translateX(0%) translateZ(1px);">
      <div class="justify-center flex media-inner-border align-center px-60" style="height: 60px">
        <h2 id="🖕📘⚙️-header" class="max-w-100p min-w-0 break-word default-font block primary-text" dir="auto" tabindex="-1">
          設定 Fμck Facebook
        </h2>
      </div>
      <div class="pos-a" style="top: 12px; right: 16px; z-index: 1;">
        <div id="🖕📘⚙️-dialog-close"
          class="flex align-center justify-center pos-r border-box br-50p ma-0 pa-0 ta-inherit no-underline no-outline bgc-btn-2 bgc-ho2 cursor-pointer "
          style="width: 36px; height: 36px;"
          role="button" tabindex="0"><i class="filter-secondary-icon icon-compat-20 cross"></i>
        </div>
      </div>
      <div class="py-16">
        <div class="bgc-tp bc-ado ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit z0 no-outline br-8 bgc-ho" role="button" tabindex="0">
          <input id="🖕📘⚙️-no-sponsors" type="checkbox" hidden checked/>
          <label for="🖕📘⚙️-no-sponsors" class="checked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            保留全部贊助貼文
          </label>
          <label for="🖕📘⚙️-no-sponsors" class="unchecked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            幹掉全部贊助貼文
          </label>
        </div>
        <div class="bgc-tp bc-ado ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit z0 no-outline br-8 bgc-ho" role="button" tabindex="0">
          <input id="🖕📘⚙️-no-friend-recommendation" type="checkbox" hidden checked/>
          <label for="🖕📘⚙️-no-friend-recommendation" class="checked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            盡量推薦別人當我朋友
          </label>
          <label for="🖕📘⚙️-no-friend-recommendation" class="unchecked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            不要推薦別人當我朋友
          </label>
        </div>
        <div class="bgc-tp bc-ado ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit z0 no-outline br-8 bgc-ho" role="button" tabindex="0">
          <input id="🖕📘⚙️-alt-logo" type="checkbox" hidden checked/>
          <label for="🖕📘⚙️-alt-logo" class="checked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            點擊 Logo 回首頁並按演算法排序
          </label>
          <label for="🖕📘⚙️-alt-logo" class="unchecked px-32 py-12 primary-text inline-block w-100p cursor-pointer" style="font-size: 1.6rem;">
            點擊 Logo 回首頁並按發文時間排序
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  const dialogRoot = el.querySelector('#🖕📘⚙️-root')
  if (dialogRoot) {
    dialogRoot.onclick = (event) => event.stopPropagation();
  }
  const dialogCloseBtn = el.querySelector('#🖕📘⚙️-dialog-close')
  if (dialogCloseBtn) {
    dialogCloseBtn.onclick = () => {
      confOverlayEl.hidden = true;
    }
  }
  const noSponsorCheckbox = el.querySelector('#🖕📘⚙️-no-sponsors');
  if(noSponsorCheckbox) {
    noSponsorCheckbox.checked = Boolean(config.NO_SPONSORS);
    noSponsorCheckbox.onchange = () => {
      config.NO_SPONSORS = noSponsorCheckbox.checked ? 1 : 0;
      saveConf(config);
    };
  }
  const noFriendRecommendationCheckbox = el.querySelector('#🖕📘⚙️-no-friend-recommendation');
  if(noFriendRecommendationCheckbox) {
    noFriendRecommendationCheckbox.checked = Boolean(config.NO_FRIEND_RECOMMENDATION);
    noFriendRecommendationCheckbox.onchange = () => {
      config.NO_FRIEND_RECOMMENDATION = noFriendRecommendationCheckbox.checked ? 1 : 0;
      saveConf(config);
    }
  }
  const altLogoCheckbox = el.querySelector('#🖕📘⚙️-alt-logo');
  if (altLogoCheckbox) {
    altLogoCheckbox.checked = Boolean(config.CHANGE_LOGO_LINK);
    altLogoCheckbox.onchange = () => {
      config.CHANGE_LOGO_LINK = altLogoCheckbox.checked ? 1 : 0;
      newLogoEl.orderBy = config.CHANGE_LOGO_LINK ? 'time' : 'algo';
      saveConf(config);
    }
  }
});

const confButtonEl = $el('div', {
  id: '🖕📘⚙️',
  'data-visualcompletion': 'ignore-dynamic',
  class: 'px-8',
}, (confButtonEl) => {
  confButtonEl.onclick = () => { confOverlayEl.hidden = false; };
  confButtonEl.innerHTML = `
<div class="block bgc-tp bc-ado cursor-pointer ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit z0 no-outline br-8 bgc-ho" role="button" tabindex="0">
  <div class="flex justify-space-between ma-0 min-w-0 py-0 pos-r z0 align-center flex-row px-8" style="min-height: 44px;">
    <div class="align-self-start flex flex-column mr-12 my-8 pos-r">
      <div class="br-50p align-center border-box inline-flex justify-center pos-r bgc-btn-2" style="height: 36px; width: 36px;">
        <i id="🖕📘⚙️-icon"></i>
      </div>
    </div>
    <div class="flex flex-1 justify-space-between ma-0 min-h-0 min-w-0 pa-0 z0 align-center flex-row pos-r">
      <div class="align-stretch flex flex-column flex-1 justify-space-between ma-0 min-h-0 min-w-0 px-0 pos-r z0 py-12">
        <div class="flex flex-column my--5 max-w-100p min-w-0 break-word default-font ta-left">
          <span class="block fw-500 primary-text" style="font-size: .9375rem; line-height: 1.3333;" dir="auto">
            設定 Fμck Facebook
          </span>
          <span class="block fw-normal secondary-text" style="margin-top: 3px; font-size: .8125rem; line-height: 1.2308;" dir="auto">
            讓我們一起 Fμck Facebook。
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
`;
});

sentinel.on('[role="dialog"] [data-visualcompletion="ignore-dynamic"]:first-child + hr', (accountDialogHrEl) => {
  accountDialogHrEl.insertAdjacentElement('afterend', confButtonEl);
});

$el('style', { id: '🖕📘-style' }, (el) => {
  document.head.appendChild(el);
  el.textContent = `
#🖕📘⚙️-icon {
  background-image: url(https://static.xx.fbcdn.net/images/emoji.php/v9/tfe/1/32/1f4a9.png);
  background-position: initial;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  height: 20px;
  width: 20px;
}
#🖕📘⚙️🌃 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-alpha-80);
  min-height: 100vh;
}
#🖕📘⚙️-header {
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 700;
}
#🖕📘-logo {
  background-image: url(https://static.xx.fbcdn.net/images/emoji.php/v9/tfe/1/32/1f4a9.png);
  background-size: contain;
  height: 40px;
  width: 40px;
}
[aria-hidden="false"] + #🖕📘-logo {
  display: none;
}
input[id^="🖕📘⚙️"]:not(:checked) ~ [for^="🖕📘⚙️"].unchecked,
input[id^="🖕📘⚙️"]:checked ~ [for^="🖕📘⚙️"].checked {
  display: none;
}
`;
});

$el('style', { id: '🖕📘-style-util' }, (el) => {
  document.head.appendChild(el);
  el.textContent = `
.__fb-dark-mode:root, .__fb-dark-mode {
  --fuck-facebook-hover-overlay: #4e4e4f;
}
:root, .__fb-light-mode {
  --fuck-facebook-hover-overlay: #d8dadf;
}
.pos-r { position: relative; }
.pos-a { position: absolute; }
.block { display: block; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.inline-block { display: inline-block; }
.flex-row { flex-direction: row;}
.flex-column { flex-direction: column;}
.flex-1 { flex: 1; }
.pa-0 { padding: 0; }
.px-0 {
  padding-left: 0;
  padding-right: 0;
}
.py-0 {
  padding-top: 0;
  padding-bottom: 0;
}
.px-8 {
  padding-left: 8px;
  padding-right: 8px;
}
.px-32 {
  padding-left: 32px;
  padding-right: 32px;
}
.py-12 {
  padding-top: 12px;
  padding-bottom: 12px;
}
.py-16 {
  padding-top: 16px;
  padding-bottom: 16px;
}
.px-60 {
  padding-left: 60px;
  padding-right: 60px;
}
.ma-0 { margin: 0; }
.my-5 {
  margin-top: 5px;
  margin-bottom: 5px;
}
.my--5 {
  margin-top: -5px;
  margin-bottom: -5px;
}
.my-8 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.mr-12 { margin-right: 12px; }
.br-8 { border-radius: 8px; }
.br-50p { border-radius: 50%; }
.bw-0 { border-width: 0; }
.bs-solid { border-style: solid; }
.bc-ado { border-color: var(--always-dark-overlay); }
.bgc-ho:hover { background-color: var(--hover-overlay); }
.bgc-ho2:hover { background-color: var(--fuck-facebook-hover-overlay) }
.bgc-tp { background-color: transparent; }
.bgc-card { background-color: var(--card-background); }
.bgc-btn-2 { background-color: var(--secondary-button-background); }
.border-box { box-sizing: border-box; }
.align-center { align-items: center; }
.align-stretch { align-items: stretch; }
.align-self-start { align-self: flex-start; }
.justify-space-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.min-h-0 { min-height: 0; }
.min-h-44 { min-height: 44px; }
.min-h-100vh { min-height: 100vh; }
.min-w-0 { min-width: 0; }
.max-w-100p { max-width: 100%; }
.z0 { z-index: 0; }
.break-word{
  word-break: break-word;
  word-wrap: break-word;
}
.default-font { font-family: var(--font-family-default)!important; }
.fw-normal { font-weight: normal; }
.fw-500 { font-weight: 500; }
.ta-left { text-align: left; }
.ta-inherit { text-align: inherit; }
.w-100p { width: 100%; }
.no-underline,
.no-underline:hover {
  text-decoration: none;
}
.no-outline {
  outline: none;
  -moz-user-select: none;
}
.no-pointer-event { pointer-event: none; }
.overflow-hidden { overflow: hidden; }
.primary-text { color: var(--primary-text); }
.secondary-text { color: var(--secondary-text); }
.cursor-pointer { cursor: pointer; }
.icon-compat-20 {
  background-image: url(/rsrc.php/v3/yv/r/hfiTRDmjVjj.png);
  background-size: 33px 1684px;
  background-repeat: no-repeat;
  display: inline-block;
  height: 20px;
  width: 20px;
}
.icon-compat-20.cross {
  background-position: 0 -903px;
}
.media-inner-border {
  border-bottom: 1px solid var(--media-inner-border);
}
.dialog-border {
  box-shadow: 0 12px 28px 0 var(--shadow-2),0 2px 4px 0 var(--shadow-1),inset 0 0 0 1px var(--shadow-inset);
}
.filter-secondary-icon {
  filter: var(--filter-secondary-icon);
}
`;
});
