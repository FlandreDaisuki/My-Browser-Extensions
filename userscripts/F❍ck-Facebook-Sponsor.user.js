// ==UserScript==
// @name         F❍ck Facebook Sponsor
// @namespace    https://github.com/FlandreDaisuki
// @version      0.5.0
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
  '[id^="fb-header-info-"]',
];

let counter = 0;

sentinel.on(rules.join(','), (el) => {
  const p = el.id.match(/:/g); // pattern
  if (p && p.length > 3) {
    el.closest('[id^="hyperfeed_story_id"]').remove();
    // You can remove 2 shashes in front of following code to show how many feeds have been removed.
    // console.debug(`F❍ck up ${++counter} sponsor feeds!`);
  }
});
