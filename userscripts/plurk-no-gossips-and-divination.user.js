// ==UserScript==
// @name         噗浪不語怪力亂神
// @name:en      Plurk: No Gossips and Divination
// @description    隱藏各式各樣問神、心裡測驗、奇怪的跟風
// @description:en Hide and mute any gossip and divination
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @author       FlandreDaisuki
// @match        https://www.plurk.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @license      MIT
// @noframes
// ==/UserScript==

/* global sentinel */

const hideEl = (el) => {
  el.hidden = true;
  el.style.display = 'none';
  el.style.opacity = 0;
};

const mute = (plurk) => {
  const toMute = plurk.querySelector('.mute-off');
  if(toMute) {
    toMute.click();
  }
};

sentinel.on('#timeline_cnt > .block_cnt > .plurk', (plurk) => {
  const content = plurk.querySelector('.td_cnt').textContent.trim();
  const qualifierEls = [...plurk.querySelectorAll('.qualifier')];
  // [問] 神
  if(qualifierEls.filter((q) => q.classList.contains('q_asks')).length && content.match(/^神\s*/g)) {
    hideEl(plurk);
    mute(plurk);
  }

  // 關鍵字
  if(content.match(/(跟風|心測|心理測驗)/g)) {
    hideEl(plurk);
    mute(plurk);
  }

  // 表情符號
  const path = [
    '3c06d451efef7089cb388307a1af57a1_w44_h17.png',
  ];
  if(plurk.querySelector(path.map((p) => `img[src="https://emos.plurk.com/${p}"]`).join(','))) {
    hideEl(plurk);
    mute(plurk);
  }
});
