// ==UserScript==
// @name        @KZN_dayo Translator
// @description @KZN_dayo Translator
// @namespace   https://github.com/FlandreDaisuki
// @match       https://twitter.com/*
// @grant       none
// @version     1.0
// @author      FlandreDaisuki
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// ==/UserScript==

/* global sentinel */

const rev = (s) => [...s].reverse().join('');
const binToText = (bin, r = false) => new TextDecoder().decode(new Uint8Array(
  bin.match(/[01]{8}/g).map((byte) => parseInt(r ? rev(byte) : byte, 2)),
));
const hexToText = (hex) => new TextDecoder().decode(new Uint8Array(
  hex.match(/[0-9a-f]{2}/ig).map((byte) => parseInt(byte, 16)),
));

const binDecode = (bin) => {
  const ans1 = binToText(bin);
  if (/[\p{scx=Hira}\p{scx=Kana}]/u.test(ans1)) { return ans1; }

  const ans2 = binToText(bin, true);
  if (/[\p{scx=Hira}\p{scx=Kana}]/u.test(ans2)) { return ans2; }

  return null;
};

const hexDecode = (hex) => {
  const ans = hexToText(hex);
  if (/[\p{scx=Hira}\p{scx=Kana}]/u.test(ans)) { return ans; }

  return null;
};

const styleEl = document.createElement('style');
document.body.appendChild(styleEl);
styleEl.textContent = `
.kzn-translate::after {
  content: var(--kzn-translate, "");
  color: #FF8888;
}
`;

sentinel.on('span', (el) => {
  if (el.children.length > 0) { return; }
  if (el.classList.contains('kzn-translate')) { return; }

  const tc = el.textContent.trim();
  if (/^[01]{16,}$/.test(tc)) {
    const decoded = binDecode(tc);
    if (decoded) {
      el.classList.add('kzn-translate');
      el.style.setProperty('--kzn-translate', JSON.stringify(' = ' + decoded));
    }
  } else if (/^[0-9a-f]{4,}$/i.test(tc)) {
    console.debug(tc, el);
    const decoded = hexDecode(tc);
    console.debug(tc, decoded);
    if (decoded) {
      el.classList.add('kzn-translate');
      el.style.setProperty('--kzn-translate', JSON.stringify(' = ' + decoded));
    }
  }
});
