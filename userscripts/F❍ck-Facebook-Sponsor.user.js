// ==UserScript==
// @name         F❍ck Facebook Sponsor
// @namespace    https://github.com/FlandreDaisuki
// @version      0.3
// @description  Remove Facebook sponsor feeds
// @author       FlandreDaisuki
// @match        https://www.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// ==/UserScript==

/* global sentinel */

sentinel.on('[id^="feed_subtitle_"]', (el) => {
  if (el.id.match(/:/g).length > 3) {
    el.closest('[id^="hyperfeed_story_id"]').remove();
  }
});
