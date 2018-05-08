// ==UserScript==
// @name         pixiv 403 redirection
// @description  pixiv 403 redirection
// @namespace    https://github.com/FlandreDaisuki
// @version      1.0.0
// @author       FlandreDaisuki
// @match        *://i.pximg.net/*
// @grant        none
// ==/UserScript==
/* eslint-disable no-restricted-globals */

(() => {
  if (document.title === '403 Forbidden') {
    const illustId = location.pathname.replace(/.*\/(\d+)_.*/, '$1');
    location.assign(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illustId}`);
  }
})();
