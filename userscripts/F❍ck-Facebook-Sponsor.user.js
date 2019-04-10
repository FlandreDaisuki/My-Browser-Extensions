// ==UserScript==
// @name         F❍ck Facebook Sponsor
// @namespace    https://github.com/FlandreDaisuki
// @version      0.4.1
// @description  Remove Facebook sponsor feeds
// @author       FlandreDaisuki
// @match        https://www.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// ==/UserScript==

/* global sentinel */

const rules = [
  '[id^="feed_subtitle_"]',
  '[id^="feedsub_title_"]',
];

sentinel.on(rules.join(','), (el) => {
  const p = el.id.match(/:/g); // pattern
  if (p && p.length > 3) {
    el.closest('[id^="hyperfeed_story_id"]').remove();
  }
});
