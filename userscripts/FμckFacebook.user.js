// ==UserScript==
// @name        Fμck Facebook
// @description Remove all Facebook shit
// @namespace   https://flandre.in/github
// @author      FlandreDaisuki
// @match       https://*.facebook.com/*
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @version     1.6.0
// @resource    faceBullshit https://github.com/FlandreDaisuki/My-Browser-Extensions/raw/master/usercss/FaceBullshit.user.css
// @noframes
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/F%CE%BCck%20Facebook/README.md
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getResourceText
// @grant       GM.getResourceText
// ==/UserScript==
(function () {
  'use strict';

  const noop = () => {};

  /** @type {(selectors: string) => HTMLElement[]} */
  const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

  /** @type {(tag: string, attr: Record<string, unknown>, cb: (el: HTMLElement) => void) => HTMLElement} */
  const $el = (tag, attr = {}, cb = noop) => {
    const el = document.createElement(tag);
    if (typeof (attr) === 'string') {
      el.textContent = attr;
    }
    else {
      Object.assign(el, attr);
    }
    cb(el);
    return el;
  };

  const $style = (stylesheet) => $el('style', stylesheet, (el) => document.head.appendChild(el));

  /* cSpell:ignoreRegExp \.[\w\d]{8}\b */
  /* cSpell:ignore posinset */
  /* global sentinel */

  /*
  推薦與以下樣式一起使用，效果更佳
  https://github.com/FlandreDaisuki/My-Browser-Extensions/tree/master/usercss#facebullshit
  */
  const faceBullshitStylesheetText = (GM_getResourceText ?? GM.getResourceText)?.('faceBullshit');
  $style(faceBullshitStylesheetText
    .replace(/@-moz-document[^{]+[{]([\s\S]+)\n[}]/g, '$1')
    .replace(/(\n\s*)if[^{]+[{]([\s\S]+?)(\1[}])/g, '$2'));

  /* fix: Facebook 壞壞 */
  sentinel.on('html._8ykn', (htmlEl) => {
    // FaceBook add following rule to disable sentinel

    // ._8ykn :not(.always-enable-animations){
    //   animation-duration:0 !important;
    //   animation-name:none !important;
    //   transition-duration:0 !important;
    //   transition-property:none !important
    // }

    htmlEl.classList.remove('_8ykn');
  });

  /* Feature 1: 刪掉贊助 */

  // ref: https://openuserjs.org/scripts/burn/Facebook_Hide_Ads_(a.k.a._sponsored_posts)/source
  /* cSpell:disable */
  /* eslint-disable */
  const sponsorWords = {
    'af':      ['Geborg'],
    'am':      ['የተከፈለበት ማስታወቂያ'],
    'ar':      ['إعلان مُموَّل'],
    'as':      ['পৃষ্ঠপোষকতা কৰা'],
    'ay':      ['Yatiyanaka'],
    'az':      ['Sponsor dəstəkli'],
    'be':      ['Рэклама'],
    'bg':      ['Спонсорирано'],
    'br':      ['Paeroniet'],
    'bs':      ['Sponzorirano'],
    'bn':      ['সৌজন্যে'],
    'ca':      ['Patrocinat'],
    'cb':      ['پاڵپشتیکراو'],
    'co':      ['Spunsurizatu'],
    'cs':      ['Sponzorováno'],
    'cx':      ['Giisponsoran'],
    'cy':      ['Noddwyd'],
    'da':      ['Sponsoreret'],
    'de':      ['Gesponsert'],
    'el':      ['Χορηγούμενη'],
    'en':      ['Sponsored', 'Chartered'],
    'eo':      ['Reklamo'],
    'es':      ['Publicidad', 'Patrocinado'],
    'et':      ['Sponsitud'],
    'eu':      ['Babestua'],
    'fa':      ['دارای پشتیبانی مالی'],
    'fi':      ['Sponsoroitu'],
    'fo':      ['Stuðlað'],
    'fr':      ['Commandité', 'Sponsorisé'],
    'fy':      ['Sponsore'],
    'ga':      ['Urraithe'],
    'gl':      ['Patrocinado'],
    'gn':      ['Oñepatrosinapyre'],
    'gx':      ['Χορηγούμενον'],
    'hi':      ['प्रायोजित'],
    'hu':      ['Hirdetés'],
    'id':      ['Bersponsor'],
    'it':      ['Sponsorizzata'],
    'ja':      ['広告'],
    'jv':      ['Disponsori'],
    'kk':      ['Демеушілік көрсеткен'],
    'km':      ['បានឧបត្ថម្ភ'],
    'lo':      ['ໄດ້ຮັບການສະໜັບສະໜູນ'],
    'mk':      ['Спонзорирано'],
    'ml':      ['സ്പോൺസർ ചെയ്തത്'],
    'mn':      ['Ивээн тэтгэсэн'],
    'mr':      ['प्रायोजित'],
    'ms':      ['Ditaja'],
    'ne':      ['प्रायोजित'],
    'nl':      ['Gesponsord'],
    'or':      ['ପ୍ରଯୋଜିତ'],
    'pa':      ['ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ'],
    'pl':      ['Sponsorowane'],
    'ps':      ['تمويل شوي'],
    'pt':      ['Patrocinado'],
    'ru':      ['Реклама'],
    'sa':      ['प्रायोजितः |'],
    'si':      ['අනුග්‍රහය දක්වන ලද'],
    'so':      ['La maalgeliyey'],
    'sv':      ['Sponsrad'],
    'te':      ['స్పాన్సర్ చేసినవి'],
    'th':      ['ได้รับการสนับสนุน'],
    'tl':      ['May Sponsor'],
    'tr':      ['Sponsorlu'],
    'tz':      ['ⵉⴷⵍ'],
    'uk':      ['Реклама'],
    'ur':      ['تعاون کردہ'],
    'vi':      ['Được tài trợ'],
    'zh-Hans': ['赞助内容'],
    'zh-Hant': ['贊助']
  }[document.documentElement.lang];
  /* eslint-enable */
  /* cSpell:enable */


  const FEED_ROOT_SELECTOR = '[role="feed"] > div, [role="article"], [aria-posinset]';

  sentinel.on('svg use', (svgUseEl) => {
    const sponsorSvgTextEls = $$('svg text').filter((textEl) => sponsorWords.includes(textEl.textContent));

    for (const sponsorSvgTextEl of sponsorSvgTextEls) {
      if (svgUseEl.attributes['xlink:href'].value !== `#${ sponsorSvgTextEl.id }`) { continue; }

      const feedRootEl = svgUseEl.closest(FEED_ROOT_SELECTOR);
      if (!feedRootEl) { continue; }

      /* eslint-disable-next-line no-console */
      console.count('🖕📘 NO_SPONSORS');
      feedRootEl.hidden = true;
    }
  });

  sentinel.on('span[id^="jsc_c"]', (sponsorEl) => {
    const sponsorElText = sponsorEl.textContent;
    const hasSponsorWord = sponsorWords.some((word) => [...word].every((ch) => sponsorElText.includes(ch)));
    if (!hasSponsorWord) { return; }

    const feedRootEl = sponsorEl.closest(FEED_ROOT_SELECTOR);
    if (!feedRootEl) { return; }

    /* eslint-disable-next-line no-console */
    console.count('🖕📘 NO_SPONSORS');
    feedRootEl.hidden = true;
  });

})();
