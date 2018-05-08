// ==UserScript==
// @name        pixiv auto smile
// @description Rating smile automatically
// @namespace   https://github.com/FlandreDaisuki
// @include     *://www.pixiv.net/member_illust.php?*
// @version     1.0.0
// @icon        http://i.imgur.com/cRWoMhw.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.3/axios.min.js
// @grant       none
// @compatible  firefox
// @compatible  chrome
// @noframes
// ==/UserScript==
/* global pixiv, axios, $ */

// Chrome compatible
if (!document.getElementsByClassName('rated').length) {
  const tt = document.querySelector('input[name="tt"]').value;
  const iid = pixiv.context.illustId;
  const uid = pixiv.context.userId;
  axios({
    method: 'POST',
    url: '/rpc_rating.php',
    data: `mode=save&i_id=${iid}&u_id=${uid}&qr=0&score=10&tt=${tt}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then(() => {
    $('.js-nice-button')
      .addClass('rated')
      .off()
      .find('.smile')
      .addClass('active');
  });
}
