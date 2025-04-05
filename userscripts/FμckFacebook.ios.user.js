// ==UserScript==
// @name        Fμck Facebook
// @description Remove all Facebook shit
// @namespace   https://flandre.in/github
// @version     1.7.0
// @match       https://*.facebook.com/*
// @require     https://unpkg.com/winkblue@0.1.1/dist/winkblue.umd.js
// @resource    faceBullshit https://raw.githubusercontent.com/FlandreDaisuki/My-Browser-Extensions/master/usercss/FaceBullshit.user.css
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getResourceText
// @grant       GM.getResourceText
// @noframes
// @author      FlandreDaisuki
// @supportURL  https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/F%CE%BCck%20Facebook/README.md
// ==/UserScript==

(function () {
  'use strict';

  const noop = () => {};
  const $$ = (selectors) => Array.from(document.querySelectorAll(selectors));

  const $el = (tag, attr = {}, cb = noop) => {
    const el = document.createElement(tag);
    if (typeof(attr) === 'string') {
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
  /* global Winkblue */
  const { winkblue } = Winkblue;

  /*
  推薦與以下樣式一起使用，效果更佳
  https://github.com/FlandreDaisuki/My-Browser-Extensions/tree/master/usercss#facebullshit
  */

  const faceBullshitStylesheetText = `/* ==UserStyle==
@name           FaceBullshit
@namespace      https://github.com/FlandreDaisuki
@version        4.0.0
@description    Beautify Facebook 2025 layout
@author         FlandreDaisuki
@license        CC-BY-SA-4.0
@updateURL      https://raw.githubusercontent.com/FlandreDaisuki/My-Browser-Extensions/master/usercss/FaceBullshit.user.css

@preprocessor stylus
@var text custom-chatroom-height '小聊天室高度' 92vh
@var checkbox no-ig '不要 instagram' 1
@var checkbox no-friends-recommandation '不要推薦朋友' 1
@var checkbox hide-non-followed-posts '隱藏未追蹤貼文' 1
==/UserStyle== */
@-moz-document domain("www.facebook.com"), domain("m.facebook.com") {
  a[aria-label="Facebook"] {
    & > svg {
      visibility: hidden;
    }
    background-repeat: no-repeat;
    background-size: cover;
    background-image: var(--icon-poop);
  }

  /* 桌面版 layout */
  @media screen and (min-width: 1280px) {
    div:has( > [role="navigation"] ~ [role="main"] ~ [role="complementary"]) {
      max-width: 100%;
    }

    /* 動態靠左 */
    [role="main"] {
      justify-content: flex-start;
    }
  }

  /* 右側欄 Sponsored */
  [role="complementary"] div:has( + [data-thumb] + [data-thumb]) div:first-child:not([class]):has( + [data-visualcompletion="ignore-dynamic"]) {
    display: none;
  }

  /* 小聊天室 root */
  [class^="x"]:has( ~ form[action*="logout"]) > [class^="x"] > [class^="x"] {
    right: 10rem;
  }

  /* 小聊天室 */
  [style*="--chat-composer"] > [tabindex] > [role="none"] > div {
    height: custom-chatroom-height;
  }

  if (no-ig) {
    [data-virtualized="false"]:has([data-visualcompletion="ignore-dynamic"][role="region"]) {
      display: none;
    }

    /* m.facebook.com */
    [data-type="vscroller"] > [class*="otf"] + [data-type="container"] {
      display: none;
    }
  }

  if (no-friends-recommandation) {
    div:has( > [style^="border"] + div:empty) {
      display: none;
    }

    /* m.facebook.com */
    [data-type="vscroller"] > [data-type="container"]:has([data-type="text"] + [data-type="container"] + [data-type="container"]) {
      display: none;
    }
  }

  if (hide-non-followed-posts) {
    /* 未追蹤貼文 */
    [aria-posinset]:has(h4 > span:not([class]) > span:not([class]) [role="button"]) {
      display:none;
    }

    /* 未加入社團 */
    [aria-posinset]:has(h4 [role="button"] [role="none"]) {
      display: none;
    }
  }

  :root {
    --icon-poop: url("data:image/webp;base64,UklGRloEAABXRUJQVlA4WAoAAAAQAAAANwAANwAAQUxQSGsBAAABkJttW1tnX0VHywjfDAzADBqABZhClxZQe1agdVRNqe7Pwdnmuv4cnO3XkSM+FoiICaDK/cfeUJMrYItbcEcANrQ47Y/w3Atjv4WXN5Qk3R/h9TdGkOpRKsqhOCpBvsyTYPuzJGoxxvkhF1wHMV3Cmt+mwWkBKmDR5E01j6WT13X4zWLAiqsE1ExcY6yCqFuBrxAqRbUc79XJvBD7IX6r888uwsM+qi/j3kDgHi9g9yFxUuuZBJGe1g+QmTq1jk5CgEGVKc5iEMrIXcrJrkhJQtQlZCVlV8RZEIYiFSVFVULdpaCkizi3YVyE4KheMX26hORAL9sNyM78kv0I2deBXtQbEH4+OvPMQ/5l8opoowEAK03HbaAnNHpsW8GqmTfNIDcTm+n+NZJ1bCSSnZv45og4nss7D0REuot7wvaCekakuBunvW/nMr7NA1OxZtuFMU7zvPft/Lzg/Pz827e9vXmep2ma4hicoecAVlA4IMgCAABQDwCdASo4ADgAPpFAm0qlo6IhpBgMALASCWQAxvHA2n4l5peNtN/1IM3hU2muwLF6T8J2BmBUiTUXpXDKGN3+r8G9JfT/ytfBZd4FMms6+TFzA4oK2/EIWA4jheiAqC1omiHNfgKn/85PS8/baEjVppCbnwTEWfaYInPlE83HzJFDAAD+/Faf/v/+A//zwBIvxM0MU0t7q6GFP0eORmpGxGqNpv74j439K9LFq3m5ZZEOjzYGABI1i/A6SovHgsuMPzT5Ff6SmRfmw35CI2Way2JOwFm+tWAbj0AO2zX/l1cOGb5LiovGZlrwGrKVznME8b7gwt0ev+fvyZffVCPD+f4ameVtxHjaGIhnH9+zpoqRo0NU9lj9Xr11G4DGomSzLD9vfUdeDKBWUEh3VKwG6d9NtyzubEidtISvhTDtRb5LXykzEDyLyo4/2sia8NMUAMZbpR99P3aAxjsymaAqZ5WNwWdAXq3GXElXGafvjiMA3yDDn31Vk9VEynBxvcZoNZ5AY3R0umSwzuuYC4Izk2Gp61l6qP+wVwB03wrdhIdnIoYQlL5sA3aChcIgoSReDRxW4XJS1nwtt848sDu0Y+RUPI4QvrvCuP60gIPtv4U8P4wSTNfdERPwybHfjR9rLrsOCMyqFFAeHkSzV5/Q6/EQm7YVYJ6BMCzQbakjyRosNGt8E2BrHmD5KFnhenTq3LnVG5z3PYM2WIIXgOlPj9TGNmlFwPNyuqMjg0Nq4bOGjg9w3ee+euyZaTJqAHFX0HLWBfAS/5sFF4FjLrN86+XdF1i8X8XZ1+1yg6vFB1OcqneUiH+Fi6x7YrbzhotZ/MGWa2lWzkNeQ9EDX3FTxsRi9FvXgHIooXwRw6vaL/1CF11ULvJXlMDCKIYNsTMF9wQiPEcstrqYnXQZUjxsc/26Ymz/IxBIHqWXEKikYBZ8jh8UqAAA");
  }
}
`;
  $style(faceBullshitStylesheetText
    .replace(/@-moz-document[^{]+[{]([\s\S]+)\n[}]/g, '$1')
    .replace(/(\n\s*)if[^{]+[{]([\s\S]+?)(\1[}])/g, '$2')
    .replace(/--chatroom-height: custom-chatroom-height;/g, '--chatroom-height: 92vh;'));

  /* fix: Facebook 壞壞 */
  winkblue.on('html._8ykn', (htmlEl) => {
    // FaceBook add following rule to disable winkblue

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

  winkblue.on('svg use', (svgUseEl) => {
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

  winkblue.on('span[id^="jsc_c"], [aria-posinset] [attributionsrc] span[aria-labelledby] > span', (sponsorEl) => {
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
