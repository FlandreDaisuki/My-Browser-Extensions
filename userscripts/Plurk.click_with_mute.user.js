// ==UserScript==
// @name         Plurk.click_with_mute
// @namespace    https://github.com/FlandreDaisuki
// @version      0.3
// @author       FlandreDaisuki
// @match        https://www.plurk.com/flandrekawaii
// @grant        none
// ==/UserScript==

/* global jQuery, GLOBAL */

const $ = jQuery;

function isFourLittleButton($target) {
  return ['mute', 'replurk', 'like', 'gift'].some((elem) => $target.hasClass(elem));
}

$('.block_cnt').on('click', function($event) {
  const $target = $($event.target);
  if (!isFourLittleButton($target)) {
    const $thread = $target.parentsUntil($event.currentTarget, '.plurk');
    if ($thread.length) {
      const uid = $thread.find('.plurk_cnt .td_qual .name').data().uid;
      const plurk = $thread.get(0);
      // 沒有愛心的且不是自己的噗才會被 mute
      if ($(plurk).find('.like-off').length && GLOBAL.session_user.id !== uid) {
        $(plurk).find('.mute-off').click();
      }
    }
  }
});
