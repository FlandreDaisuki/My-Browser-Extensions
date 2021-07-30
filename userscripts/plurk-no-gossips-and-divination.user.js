// ==UserScript==
// @name         噗浪不語怪力亂神
// @name:en      Plurk: No Gossips and Divination
// @description    隱藏各式各樣問神、心理測驗、奇怪的跟風
// @description:en Hide and mute any gossip and divination
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1.5
// @author       FlandreDaisuki
// @match        https://www.plurk.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @license      MIT
// @noframes
// ==/UserScript==

/* cSpell:ignore shindanmaker */
/* global sentinel, GLOBAL */

const hideEl = (el) => {
  el.hidden = true;
  el.style.display = 'none';
  el.style.opacity = 0;
};

const mute = (plurk) => {
  const toMute = plurk.querySelector('.mute-off');
  if (toMute) {
    toMute.click();
  }
};

sentinel.on('#timeline_cnt > .block_cnt > .plurk', (plurk) => {
  const content = plurk.querySelector('.td_cnt').textContent.trim();
  const qualifierEls = [...plurk.querySelectorAll('.qualifier')];

  // 例外條件
  const exceptConditions = [
    // 自己
    plurk.textContent.includes(GLOBAL.session_user.display_name),
  ];

  // 表情符號網址
  const emos = [
    '3c06d451efef7089cb388307a1af57a1_w44_h17.png', // 跟風
    '79269cb907d5e8f5a2737586c2693389_w44_h17.gif', // 跟風
  ];

  // 黑名單網址
  const blackList = [
    '//shindanmaker.com',
    '//kuizy.net',
  ];

  // 隱藏條件
  const hideConditions = [
    [...plurk.querySelectorAll('.ex_link')].some((a) => blackList.some((black) => a.getAttribute('href').includes(black))),
    // [問] 神
    qualifierEls.filter((q) => q.classList.contains('q_asks')).length && content.match(/^神\s*/g),
    // 關鍵字
    content.match(/(跟風|心測|心理測驗|性向測驗)/g),
    // 表情符號
    plurk.querySelector(emos.map((emo) => `img[src="https://emos.plurk.com/${ emo }"]`).join(',')),
  ];

  if (exceptConditions.some(Boolean)) {
    return;
  }

  if (hideConditions.some(Boolean)) {
    hideEl(plurk);
    mute(plurk);
  }
});
