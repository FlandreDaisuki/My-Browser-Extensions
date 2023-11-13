// ==UserScript==
// @name         plurk click and mute
// @description  除非愛心，否則靜音
// @namespace    https://github.com/FlandreDaisuki
// @require      https://unpkg.com/winkblue@0.0.3/dist/winkblue.js
// @version      1.0.1
// @author       FlandreDaisuki
// @match        https://www.plurk.com/*
// @grant        none
// @noframes
// ==/UserScript==

/* global GLOBAL, winkblue */

const $findAll = (el, s) => Array.from(el.querySelectorAll(s));
const $find = (el, s) => $findAll(el, s)[0];

function isPrivatePlurk(plurkEl) {
  return $findAll(plurkEl, '.private').length > 0;
}

function isSelf(uid) {
  return GLOBAL.session_user.id === uid;
}

function isLiked(plurkEl) {
  return $findAll(plurkEl, '.like-on').length > 0;
}

winkblue.on('[data-type="plurk"]', (plurkEl) => {
  // console.log('plurkEl', plurkEl)
  if (plurkEl.__click_and_mute) { return; }
  plurkEl.__click_and_mute = true;

  const uid = $find(plurkEl, '.plurk_cnt .td_qual .name')?.dataset.uid;
  // console.log('plurkEl', plurkEl, isLiked(plurkEl), isSelf(uid), isPrivatePlurk(plurkEl));
  if (!isLiked(plurkEl) && !isSelf(uid) && !isPrivatePlurk(plurkEl)) {
    plurkEl.addEventListener('click', () => {
      $find(plurkEl, '.mute-off')?.click()
    });
  }
});
