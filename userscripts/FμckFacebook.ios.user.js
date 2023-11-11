// ==UserScript==
// @name        Fμck Facebook
// @description Remove all Facebook shit
// @namespace   https://flandre.in/github
// @version     1.6.3
// @match       https://*.facebook.com/*
// @require     https://unpkg.com/winkblue@0.0.3/dist/winkblue.js
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
  /* global winkblue */

  /*
  推薦與以下樣式一起使用，效果更佳
  https://github.com/FlandreDaisuki/My-Browser-Extensions/tree/master/usercss#facebullshit
  */

  const faceBullshitStylesheetText = `/* ==UserStyle==
@name           FaceBullshit
@namespace      https://github.com/FlandreDaisuki
@version        3.2.3
@description    Beautify Facebook 2022 layout
@author         FlandreDaisuki
@license        CC-BY-SA-4.0
@updateURL      https://raw.githubusercontent.com/FlandreDaisuki/My-Browser-Extensions/master/usercss/FaceBullshit.user.css

@preprocessor stylus
@var text custom-chatroom-height '小聊天室高度' 92vh
@var checkbox no-ig '不要 instagram' 1
@var checkbox no-left-col '不要左引導欄' 1
@var checkbox no-right-col '不要右聊天欄' 1
@var checkbox no-video-chat '不要視訊圈' 1
@var checkbox no-friends-recommandation '不要推薦朋友' 1
==/UserStyle== */
@-moz-document domain("www.facebook.com"), domain("m.facebook.com") {

  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

  /* 本樣式 logo */
  [aria-label="Facebook"][role="link"] {
    margin: 0;
  }
  [aria-label="Facebook"][role="link"]::before {
    content: 'facebullshit';
    display: block;
    font-size: 2rem;
    color: var(--fb-wordmark);
    font-family: 'Fredoka One', cursive;
  }
  [aria-label="Facebook"][role="link"] > svg {
    display: none;
  }
  [role="navigation"] > span svg ~ div:last-child,
  [role="navigation"] > span svg > mask > circle[r="8"] {
    display: none;
  }

  /* m.facebook.com */
  #viewport #root {
    margin-left: 0;
  }

  /* 自訂聊天室高度 */
  /*
  .x164qtfw { right: 80px; }
  .xixxii4 { position: fixed; }
  .x1rgmuzj { height: 455px; }
  */
  .x164qtfw.xixxii4 .x1rgmuzj {
    --chatroom-height: custom-chatroom-height;
    height: var(--chatroom-height, 455px);
  }

  /* 舊版上引導欄 */
  [role="banner"] [role="navigation"] > ul {
    display: none;
  }
  [role="banner"] > .xmy5rp.xmy5rp {
    width: 680px;
    left: 50%;
    transform: translateX(-50%);
  }

  /*
  粉專的上引導欄
  .x6q1hpd { left: 160px; }
  */
  [role="banner"] > .x6q1hpd {
    left: 240px;
  }
  input[role="combobox"] {
    padding-left: 32px;
  }

  footer {
    display: none;
  }

  /* 不要左引導欄 */
  if (no-left-col) {
    .x1mdubkq.x1mdubkq {
      display: none;
    }
    html > body {
      --global-panel-width-expanded: 0px;
    }
    h1 + [role="main"] {
      padding: 0;
      justify-content: flex-start;
      margin-left: 80px;
    }

    /* 新版 */
    [role="banner"] + [data-isanimatedlayout="true"].xn2luse.xn2luse {
      width: var(--global-panel-width);
    }
    [role="banner"] + [data-isanimatedlayout="true"].x2lf9qy.x2lf9qy {
      border-right: 1px solid var(--wash);
    }
    [data-isanimatedlayout="true"].xv0u79y.xv0u79y {
      left: var(--global-panel-width);
    }
    [data-isanimatedlayout="true"] .xylbxtu.xylbxtu {
      max-width: initial;
    }

    /* 舊版 */
    [role="navigation"].xxc7z9f {
      min-width: initial;
      flex-basis: 60px;
      border-right: 1px solid var(--wash, #3E4042);
    }
    [role="separator"] {
      margin-left: 8px;
      margin-right: 8px;
    }
    /* 顯示更多 */
    [role="navigation"] h2 + div ul > li > [style],
    [role="navigation"] h2 + div ul + [style] {
      padding: 0 4px !important;
    }
    /* 左側圖片 box */
    [role="navigation"] h2 + div ul .xv3fwf9 {
      transform: scale(0.8);
      margin: 0 9999px 0 0;
    }
    /* 你的捷徑 */
    [role="navigation"] h2 + div .xwib8y2 {
      height: 0;
      opacity: 0;
      visibility: hidden;
    }
  }

  /* 不要右聊天欄 */
  if (no-right-col) {
    [role="complementary"] {
      display: none;
    }
  }

  /* 不要 instagram */
  if (no-ig) {
    div:not([style]) > [role="region"]:first-child {
      display: none;
    }

    /* m.facebook.com */
    #viewport #MStoriesTray {
      display: none;
    }
  }

  /* 不要視訊圈 */
  if (no-video-chat) {
    div[data-visualcompletion="ignore-dynamic"][class=""] {
      display: none;
    }
  }

  /* 不要推薦朋友 */
  if(no-friends-recommandation) {
    .x1lliihq [data-0="0"] + div[class] {
      display: none;
    }
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

  winkblue.on('span[id^="jsc_c"]', (sponsorEl) => {
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
