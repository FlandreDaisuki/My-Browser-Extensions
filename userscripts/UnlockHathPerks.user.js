// ==UserScript==
// @name               Unlock Hath Perks
// @name:zh-TW         解鎖 Hath Perks
// @name:zh-CN         解锁 Hath Perks
// @description        Unlock Hath Perks and add other helpers
// @description:zh-TW  解鎖 Hath Perks 及增加一些小工具
// @description:zh-CN  解锁 Hath Perks 及增加一些小工具
// @namespace          https://github.com/FlandreDaisuki
// @version            2.0.3
// @match              *://e-hentai.org/*
// @match              *://exhentai.org/*
// @require            https://unpkg.com/vue@2.6.9/dist/vue.min.js
// @icon               https://i.imgur.com/JsU0vTd.png
// @grant              GM_setValue
// @grant              GM_getValue
// @noframes
//
// Addition metas
//
// @supportURL    https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL   https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/UnlockHathPerks.md
// @author        FlandreDaisuki
// @license       MPLv2
// @compatible    firefox 52+
// @compatible    chrome 55+
// @incompatible  any not support async/await, CSS-grid browsers
// ==/UserScript==

/* global Vue */

/** ***************** */
/* helper functions */

const noop = () => { };
const $ = (s, d = document) => d.querySelector(s);
const $el = (tag, attr = {}, cb = noop) => {
  const el = document.createElement(tag);
  if (typeof (attr) === 'string') {
    el.textContent = attr;
  } else {
    Object.assign(el, attr);
  }
  cb(el);
  return el;
};
const $style = (text) => {
  $el('style', text, (el) => document.head.appendChild(el));
};

/* helper functions end */
/** ********************* */

/** ********* */
/* easy DOM */

// nav
const nb = $('#nb');
const navdiv = $el('div');
const navbtn = $el('a', 'Unlock Hath Perks');
navbtn.id = 'uhp-btn';
navbtn.addEventListener('click', () => {
  $('#uhp-panel-container').classList.remove('hidden');
});
nb.appendChild(navdiv);
navdiv.appendChild(navbtn);

// panel container
const uhpPanelContainer = $el('div', {
  className: 'hidden',
  id: 'uhp-panel-container',
});
uhpPanelContainer.addEventListener('click', () => {
  uhpPanelContainer.classList.add('hidden');
});
document.body.appendChild(uhpPanelContainer);

// panel
const uhpPanel = $el('div', { id: 'uhp-panel' }, (el) => {
  if (location.host === 'exhentai.org') {
    el.classList.add('dark');
  }
  el.addEventListener('click', (ev) => ev.stopPropagation());
});
uhpPanelContainer.appendChild(uhpPanel);

/* easy DOM end */
/** ************* */

/** ******************* */
/* configs and events */

const uhpConfig = {
  abg: true,
  mt: true,
  pe: true,
};

Object.assign(uhpConfig, GM_getValue('uhp', uhpConfig));
GM_setValue('uhp', uhpConfig);

if (uhpConfig.abg) {
  Object.defineProperty(window, 'adsbyjuicy', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.create(null),
  });
}


// More Thumbs code block
if (location.pathname.startsWith('/g/')) {
  (async () => {
    const getGalleryPageState = async (url, selectors) => {
      const result = {
        elements: [],
        nextURL: null,
      };

      if (!url) { return result; }

      const resp = await fetch(url, {
        credentials: 'same-origin',
      });

      if (resp.ok) {
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const $find = (s) => ($(s, doc) || { children: [] });
        result.elements = [...$find(selectors.parent).children];

        const nextEl = $find(selectors.np);
        result.nextURL = nextEl ? (nextEl.href || null) : null;
      }

      console.log(result);
      return result;
    };

    const selectors = {
      np: '.ptt td:last-child > a',
      parent: '#gdt',
    };

    const pageState = {
      parent: $(selectors.parent),
      locked: false,
      nextURL: null,
    };

    const thisPage = await getGalleryPageState(location.href, selectors);

    while (pageState.parent.firstChild) {
      pageState.parent.firstChild.remove();
    }

    thisPage.elements
      .filter((el) => !el.classList.contains('c'))
      .forEach((el) => pageState.parent.appendChild(el));
    pageState.nextURL = thisPage.nextURL;
    if (!pageState.nextURL) {
      return;
    }

    if (uhpConfig.mt) {
      // search page found results

      document.addEventListener('scroll', async () => {
        const anchorTop = $('table.ptb').getBoundingClientRect().top;
        const vh = window.innerHeight;

        if (anchorTop < vh * 2 && !pageState.lock && pageState.nextURL) {
          pageState.lock = true;

          const nextPage = await getGalleryPageState(pageState.nextURL, selectors);
          nextPage.elements
            .filter((el) => !el.classList.contains('c'))
            .forEach((el) => pageState.parent.appendChild(el));
          pageState.nextURL = nextPage.nextURL;

          pageState.lock = false;
        }
      });
    }
  })();
}

// Page Enlargement code block
if ($('#searchbox') && $('.itg')) {
  (async () => {
    const getPageState = async (url, selectors) => {
      const result = {
        elements: [],
        nextURL: null,
      };

      if (!url) { return result; }

      const resp = await fetch(url, {
        credentials: 'same-origin',
      });

      if (resp.ok) {
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const $find = (s) => ($(s, doc) || { children: [] });
        result.elements = [...$find(selectors.parent).children];

        const nextEl = $find(selectors.np);
        result.nextURL = nextEl ? (nextEl.href || null) : null;
      }

      console.log(result);
      return result;
    };

    const modet = Boolean($('table.itg'));
    const status = $el('h1', { textContent: 'Loading...', id: 'uhp-status' });
    const selectors = {
      np: '.ptt td:last-child > a',
      parent: modet ? 'table.itg > tbody' : 'div.itg',
    };

    const pageState = {
      parent: $(selectors.parent),
      locked: false,
      nextURL: null,
    };

    const thisPage = await getPageState(location.href, selectors);

    while (pageState.parent.firstChild) {
      pageState.parent.firstChild.remove();
    }

    thisPage.elements.forEach((el) => pageState.parent.appendChild(el));
    pageState.nextURL = thisPage.nextURL;
    if (!pageState.nextURL) {
      status.textContent = 'End';
    }

    if (uhpConfig.pe) {
      $('table.ptb').replaceWith(status);

      // search page found results

      document.addEventListener('scroll', async () => {
        const anchorTop = status.getBoundingClientRect().top;
        const vh = window.innerHeight;

        if (anchorTop < vh * 2 && !pageState.lock && pageState.nextURL) {
          pageState.lock = true;

          const nextPage = await getPageState(pageState.nextURL, selectors);
          nextPage.elements.forEach((el) => pageState.parent.appendChild(el));
          pageState.nextURL = nextPage.nextURL;
          if (!pageState.nextURL) {
            status.textContent = 'End';
          }
          pageState.lock = false;
        }
      });
    }
  })();
}

/* configs and events end */
/** *********************** */


/** ************* */
/* option panel */

const uhpPanelTmpl = `
<div id="uhp-panel" :class="{ dark: isExH }" @click.stop>
  <h1>Hath Perks</h1>
  <div>
    <div v-for="d in HathPerks" class="option-grid">
      <div class="material-switch">
        <input :id="confid(d.abbr)" type="checkbox" v-model="conf[d.abbr]" @change="save" />
        <label :for="confid(d.abbr)"></label>
      </div>
      <span class="uhp-conf-title">{{d.title}}</span>
      <span class="uhp-conf-desc">{{d.desc}}</span>
    </div>
  </div>
</div>
`;

// eslint-disable-next-line no-new
new Vue({
  el: '#uhp-panel',
  template: uhpPanelTmpl,
  data: {
    conf: uhpConfig,
    HathPerks: [{
      abbr: 'abg',
      title: 'Ads-Be-Gone',
      desc: 'Remove ads. You can use it with adblock webextensions.',
    }, {
      abbr: 'mt',
      title: 'More Thumbs',
      desc: 'Scroll infinitely in gallery pages.',
    }, {
      abbr: 'pe',
      title: 'Paging Enlargement',
      desc: 'Scroll infinitely in search results pages.',
    }],
    Others: [],
  },
  computed: {
    isExH() { return location.host === 'exhentai.org'; },
  },
  methods: {
    save() { GM_setValue('uhp', uhpConfig); },
    confid(id) { return `ubp-conf-${id}`; },
  },
});

$style(`
/* override */
table.itc + p.nopm {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
#f_search {
  max-width: 95%;
  margin: 5px 0;
}
#nb {
  max-width: initial;
  justify-content: center;
}
.gl1t {
  display: flex;
  flex-flow: column;
}
.gl1t > .gl3t {
  flex: 1;
}
.gl1t > .gl3t > a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
div#gdt {
  clear: initial;
  display: flex;
  flex-flow: wrap;
}
/* uhp */
#uhp-btn {
  cursor: pointer;
}
#uhp-panel-container {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(200, 200, 200, 0.7);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
#uhp-panel-container.hidden {
  visibility: hidden;
  opacity: 0;
}
#uhp-panel {
  padding: 1.2rem;
  background-color: floralwhite;
  border-radius: 1rem;
  font-size: 1rem;
  color: darkred;
  max-width: 650px;
}
#uhp-panel.dark {
  background-color: dimgray;
  color: ghostwhite;
}
#uhp-panel .option-grid {
  display: grid;
  grid-template-columns: max-content 120px 1fr;
  grid-gap: 0.5rem 1rem;
  margin: 0.5rem 1rem;
}
#uhp-panel .option-grid > * {
  display: flex;
  justify-content: center;
  align-items: center;
}
#uhp-full-width-container.fullwidth,
#uhp-full-width-container.fullwidth div.itg {
  max-width: none;
}
#uhp-full-width-container div.itg {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  grid-gap: 2px;
}
#uhp-full-width-container div.itg.uhp-tpf-dense {
  grid-auto-flow: dense;
}
#uhp-full-width-container div.id1 {
  height: 345px;
  float: none;
  display: flex;
  flex-direction: column;
  margin: 3px auto;
  padding: 4px 0;
}
#uhp-full-width-container div.id2 {
  overflow: visible;
  height: initial;
  margin: 4px auto;
}
#uhp-full-width-container div.id3 {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.uhp-list-parent-eh tr:nth-of-type(2n+1) {
  background-color: #EDEBDF;
}
.uhp-list-parent-eh tr:nth-of-type(2n+2) {
  background-color: #F2F0E4;
}
.uhp-list-parent-exh tr:nth-of-type(2n+1) {
  background-color: #363940;
}
.uhp-list-parent-exh tr:nth-of-type(2n+2) {
  background-color: #4F535B;
}
#uhp-status {
  text-align: center;
  font-size: 3rem;
  clear: both;
  padding: 2rem 0;
}

/* https://bootsnipp.com/snippets/featured/material-design-switch */
.material-switch {
  display: inline-block;
}

.material-switch > input[type="checkbox"] {
  display: none;
}

.material-switch > input[type="checkbox"] + label {
  display: inline-block;
  position: relative;
  margin: 6px;
  border-radius: 8px;
  width: 40px;
  height: 16px;
  opacity: 0.3;
  background-color: rgb(0, 0, 0);
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease-in-out;
}

.material-switch > input[type="checkbox"] + label::after {
  position: absolute;
  top: -4px;
  left: -4px;
  border-radius: 16px;
  width: 24px;
  height: 24px;
  content: "";
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}

.material-switch > input[type="checkbox"]:checked + label {
  background-color: #0e0;
  opacity: 0.7;
}

.material-switch > input[type="checkbox"]:checked + label::after {
  background-color: inherit;
  left: 20px;
}
.material-switch > input[type="checkbox"]:disabled + label::after {
  content: "\\f023";
  line-height: 24px;
  font-size: 0.8em;
  font-family: FontAwesome;
  color: initial;
}`);

$el('link', {
  href: 'https://use.fontawesome.com/releases/v5.8.0/css/all.css',
  rel: 'stylesheet',
  integrity: 'sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y',
  crossOrigin: 'anonymous',
}, (el) => document.head.appendChild(el));
