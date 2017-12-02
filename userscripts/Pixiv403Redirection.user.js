// ==UserScript==
// @name         Pixiv 403 redirection
// @description  Pixiv 403 redirection
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @author       FlandreDaisuki
// @match        *://i.pximg.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'
  if (document.title === '403 Forbidden') {
    const illustId = location.pathname.replace(/.*\/(\d+)_.*/, '$1')
    location.assign(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illustId}`)
  }
})()
