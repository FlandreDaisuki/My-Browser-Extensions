// ==UserScript==
// @name         F❍ck Facebook Sponsor
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  F❍ck Facebook Sponsor
// @author       FlandreDaisuki
// @match        https://www.facebook.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/sentinel-js/0.0.5/sentinel.min.js
// @grant        none
// @noframes
// ==/UserScript==

/* global sentinel */

sentinel.on('.h_-944wqvyb', (el) => {
  el.closest('[id^="hyperfeed_story_id"]').remove();
});
