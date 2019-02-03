// ==UserScript==
// @name         F❍ck Facebook Sponsor
// @namespace    https://github.com/FlandreDaisuki
// @version      0.2
// @description  Remove Facebook sponsor feeds
// @author       FlandreDaisuki
// @match        https://www.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// ==/UserScript==

/* global sentinel */

sentinel.on('.h_-944wqvyb', (el) => {
  el.closest('[id^="hyperfeed_story_id"]').remove();
});
