// ==UserScript==
// @name         Fμck Facebook
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1.0
// @description  Remove all Facebook shit
// @author       FlandreDaisuki
// @match        https://*.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// ==/UserScript==

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

const DEFAULT_CONF = Object.freeze({
  NO_SPONSORS: 1,
  NO_FRIEND_RECOMMENDATION: 1,
  NO_CHANGE_LOGO_LINK: 1,
});

const saveConf = (conf) => localStorage.setItem('🖕📘', JSON.stringify(conf));
const loadConf = () => {
  try {
    return JSON.parse(localStorage.getItem('🖕📘'));
  } catch (exception) {
    saveConf(DEFAULT_CONF);
    return loadConf();
  }
};

/* Feature 1: 刪掉贊助 */
const sponsorFeedsRules = [
  '[href="#"] > span > b',
  'span[id^="jsc"] > span + div',
];

/* Feature 2: 刪掉你可能認識誰誰誰 */
const recommendFriendRules = [
  'div:empty + div.j83agx80.l9j0dhe7.k4urcfbm',
];

sentinel.on([...sponsorFeedsRules, ...recommendFriendRules].join(','), (sponsorEl) => {
  const feedRootEl = sponsorEl.closest('[data-pagelet^="FeedUnit_"]');
  if (feedRootEl) {
    feedRootEl.hidden = true;
  }
});

/* Feature 3: 按左上 Logo 以時間排序而非推薦系統 */
window.customElements.define('alt-facebook-logo', class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      location.href = this.href;
    });
    this.addEventListener('mouseover', () => {
      this.style.cursor = 'pointer';
    });
  }
  get href() {
    return this.getAttribute('href');
  }
  set href(v) {
    this.setAttribute('href', v);
  }
});
sentinel.on('[role="banner"] a[aria-label="Facebook"]:not([href="https://www.facebook.com/?sk=h_chr"])', (oldLogoEl) => {
  const newLogoEl = $el('alt-facebook-logo', {
    'id': '🖕📘-logo',
    'href': 'https://www.facebook.com/?sk=h_chr',
    'title': '依時間排序',
    'tabindex': 0,
  });
  oldLogoEl.replaceWith(newLogoEl);
});

/* Feature 4: 以上皆可個別設定 */
const confOverlayEl = $el('div', {
  id: '🖕📘⚙️🌃',
  hidden: true,
}, (el) => {
  document.body.appendChild(el);
  el.addEventListener('click', (ev) => {
    ev.stopPropagation();
    confOverlayEl.hidden = true;
  });
  el.innerHTML = `
<div class="flex align-center justify-center min-w-100p min-h-100vh">
  <div class="flex flex-column no-outline overflow-hidden pos-r z0 cwj9ozl2 br-8 nwpbqux9 w-100p" role="dialog" style="max-width: 548px; height: 233px;">
    <div class="pos-a w-100p" style="transform: translateX(0%) translateZ(1px);">
      <div class="justify-center flex linmgsc8 align-center px-60" style="height: 60px">
        <h2 class="no-outline max-w-100p min-w-0" dir="auto" tabindex="-1"><span
            class="max-w-100p min-w-0 break-word default-font block primary-text"
            style="font-size: 1.25rem; line-height: 1.2; font-weight: 700;"
            dir="auto">設定 Fμck Facebook</span></h2>
      </div>
      <div class="pos-a" style="top: 12px; right: 16px; z-index: 1;">
        <div aria-label="關閉"
          class="oajrlxb2 bgc-btn-2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz border-box cursor-pointer flex ma-0 pa-0 ta-inherit no-underline no-outline pos-r p8dawk7l align-center s45kfl79 emlxlaya bkmhp75w spb7xbtv bw-0 justify-center tv7at329 thwo4zme bgc-ho2"
          role="button" tabindex="0"><i class="m6k467ps icon-compat-20 cross"></i>
        </div>
      </div>
      <div class="py-16">
        <div
        class="px-8 oajrlxb2 bgc-tp bc-ado bs-solid bw-0 border-box cursor-pointer block ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit no-underline z0 no-outline p8dawk7l br-8 bgc-ho"
        role="button" tabindex="0">
          <input id="🖕📘⚙️-no-sponsors" name="no-sponsors" type="checkbox" />
          <label for="🖕📘⚙️-no-sponsors">幹掉全部贊助貼文</label>
        </div>
        <div
          class="px-8 oajrlxb2 bgc-tp bc-ado bs-solid bw-0 border-box cursor-pointer block ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit no-underline z0 no-outline p8dawk7l br-8 bgc-ho"
          role="button" tabindex="0">
          <div
            class="bs-solid bw-0 border-box flex flex-1 justify-space-between ma-0 min-w-0 py-0 pos-r z0 align-center flex-row px-8" style="min-height: 44px;">
            <div class="nqmvxvec flex flex-column tvfksri0 aov4n071 bi6gxh9e pos-r">
              <div
                class="s45kfl79 emlxlaya bkmhp75w spb7xbtv align-center bw-0 border-box pq6dq46d justify-center pos-r bgc-btn-2 ljni7pan" style="height: 60px">
                <i class="lzf7d6o1 sp_i_Z6SWwyuAx sx_29d1df"></i></div>
            </div>
            <div
              class="bs-solid bw-0 border-box flex flex-1 justify-space-between ma-0 min-h-0 min-w-0 pa-0 z0 align-center flex-row pos-r">
              <div
                class="align-stretch bs-solid bw-0 border-box flex flex-column flex-1 justify-space-between ma-0 min-h-0 min-w-0 px-0 pos-r z0 rj1gh0hx pybr56ya f10w8fjw">
                <div>
                  <div class="flex flex-column ew0dbk1b irj2b8pg">
                    <div class="my-5"><span
                        class="max-w-100p min-w-0 break-word default-font block a5q79mjw g1cxx5fr fw-500 primary-text ta-left"
                        dir="auto">發生錯誤</span></div>
                    <div class="my-5"><span
                        class="max-w-100p min-w-0 break-word default-font block jq4qci2q a3bd9o3v fw-normal secondary-text ta-left"
                        dir="auto">讓我們知道功能故障的問題。</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
  el.querySelector('[role="dialog"]').addEventListener('click', (ev) => {
    ev.stopPropagation();
  });
  el.querySelector('[aria-label="關閉"]').addEventListener('click', () => {
    confOverlayEl.hidden = true;
  });
});

const confButtonEl = $el('div', {
  id: '🖕📘⚙️',
  'data-visualcompletion': 'ignore-dynamic',
  style: 'padding-left: 8px; padding-right: 8px;',
}, (el) => {
  el.addEventListener('click', () => {
    confOverlayEl.hidden = false;
  });
  el.innerHTML = `
<div class="oajrlxb2 align-stretch bgc-tp bc-ado bs-solid bw-0 border-box cursor-pointer block flex-row ma-0 min-h-0 min-w-0 pa-0 pos-r ta-inherit no-underline z0 no-outline br-8 bgc-ho" role="button" tabindex="0">
  <div class="bs-solid bw-0 border-box flex flex-1 justify-space-between ma-0 min-w-0 py-0 pos-r z0 align-center flex-row px-8" style="min-height: 44px;">
    <div class="align-self-start flex flex-column mr-12 my-8 pos-r">
      <div class="br-50p align-center bw-0 border-box inline-flex justify-center pos-r bgc-btn-2" style="height: 36px; width: 36px;">
        <i id="🖕📘⚙️-icon"></i>
      </div>
    </div>
    <div class="bs-solid bw-0 border-box flex flex-1 justify-space-between ma-0 min-h-0 min-w-0 pa-0 z0 align-center flex-row pos-r">
      <div class="align-stretch bs-solid bw-0 border-box flex flex-column flex-1 justify-space-between ma-0 min-h-0 min-w-0 px-0 pos-r z0 py-12">
        <div class="">
          <div class="flex flex-column my--5">
            <div class="my-5">
              <span class="max-w-100p min-w-0 break-word default-font block line-height-hack jq4qci2q a3bd9o3v fw-500 primary-text ta-left" dir="auto">設定 Fμck Facebook</span>
            </div>
            <div class="my-5">
              <span class="max-w-100p min-w-0 break-word default-font block line-height-hack tia6h79c iv3no6db e9vueds3 j5wam9gi fw-normal secondary-text ta-left" dir="auto">幫助我們 Fμck Facebook。</span>
            </div>
          </div>
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
#🖕📘-logo {
  background-image: url(https://static.xx.fbcdn.net/images/emoji.php/v9/tfe/1/32/1f4a9.png);
  background-size: contain;
  height: 40px;
  width: 40px;
}
[aria-hidden="false"] + #🖕📘-logo {
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
.line-height-hack::before,
.line-height-hack::after {
  content: "";
  display: block;
  height: 0;
}
.pos-r { position: relative; }
.pos-a { position: absolute; }
.block { display: block; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
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
/*
.icon-compat-20.light-cross {
  background-position: 0 -924px;
}
*/
`;
});
