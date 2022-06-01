// ==UserScript==
// @name         Fμck Facebook
// @namespace    https://github.com/FlandreDaisuki
// @version      1.3.2
// @description  Remove all Facebook shit
// @author       FlandreDaisuki
// @match        https://*.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @noframes
// ==/UserScript==

/* cSpell:ignoreRegExp \.[\w\d]{8}\b */
/* cSpell:ignore algo visualcompletion rsrc */
/* global sentinel */

/*
推薦與以下樣式一起使用，效果更佳
https://github.com/FlandreDaisuki/My-Browser-Extensions/tree/master/usercss#facebullshit
*/
const LOCALE_DICT = ((lang) => {
  switch (lang.toLowerCase()) {
    case 'zh-hant':
      return {
        settingsTitle: 'Fμck Facebook',
        fuckSponsors: '幹掉全部贊助貼文',
        fuckFriendsRecommendation: '不要推薦別人當我朋友',
        fuckPostsRecommendation: '不要推薦貼文',
      };
    default:
      return {
        settingsTitle: 'Fμck Facebook',
        fuckSponsors: 'Fμck off sponsors',
        fuckFriendsRecommendation: 'Fμck off friends recommendation',
        fuckPostsRecommendation: 'Fμck off posts recommendation',
      };
  }
})(document.documentElement.lang);

const $t = (keyPath) => {
  return keyPath.split('.').reduce((dict, kp) => dict?.[kp], LOCALE_DICT) ?? keyPath;
};

const noop = () => {};
const $el = (tag, attrs = {}, callback = noop) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  callback(el);
  return el;
};

const DEFAULT_CONF = {
  NO_SPONSORS: 1,
  NO_FRIENDS_RECOMMENDATION: 1,
  NO_POSTS_RECOMMENDATION: 1,
};

const saveConf = (conf) => GM_setValue(GM_info.script.version, conf);
const loadConf = () => {
  const config = GM_getValue(GM_info.script.version);
  if (!config) {
    saveConf(DEFAULT_CONF);
    return loadConf();
  }
  return config;
};

const config = loadConf();

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

sentinel.on('span[id^="jsc_c"]', (sponsorEl) => {
  if (!config.NO_SPONSORS) { return; }

  const sponsorElText = sponsorEl.textContent;
  const hasSponsorWord = sponsorWords.some((word) => [...word].every((ch) => sponsorElText.includes(ch)));
  if (!hasSponsorWord) { return; }

  const feedRootEl = sponsorEl.closest('[role="feed"] > div');
  if (!feedRootEl) { return; }

  /* eslint-disable-next-line no-console */
  console.count('🖕📘 NO_SPONSORS');
  feedRootEl.hidden = true;
});

/* Feature 2: 刪掉你可能認識誰誰誰 */
const recommendFriendsRules = [
  'div:empty + div.j83agx80.l9j0dhe7.k4urcfbm',
];

sentinel.on(recommendFriendsRules.join(','), (recommendFriendsEl) => {
  const feedRootEl = recommendFriendsEl.closest('[data-pagelet^="FeedUnit_"]');
  if (feedRootEl && config.NO_FRIENDS_RECOMMENDATION) {
    /* eslint-disable-next-line no-console */
    console.count('🖕📘 NO_FRIENDS_RECOMMENDATION');
    feedRootEl.hidden = true;
  }
});

/* Feature 3: 刪掉「為你推薦」 */
const recommendPostsRules = [
  '.j1vyfwqu',
];

sentinel.on(recommendPostsRules.join(','), (recommendPostsEl) => {
  if (!config.NO_POSTS_RECOMMENDATION) { return; }

  const hasFriendsInteraction = recommendPostsEl.querySelectorAll('a').length > 0;
  if (hasFriendsInteraction) { return; }

  const feedRootEl = recommendPostsEl.closest('[data-pagelet^="FeedUnit_"]');

  /* eslint-disable-next-line no-console */
  console.count('🖕📘 NO_POSTS_RECOMMENDATION');
  feedRootEl.hidden = true;
});


/* Feature 4: 以上皆可個別設定 */

const findProfileConfigEl = () => {
  return [...document.querySelectorAll('#ssrb_top_nav_start ~ div [style*="translateZ"]')].filter((el) => {
    return el.offsetParent;
  })[0];
};

const resetProfileDrawer = () => {
  const profileConfigEl = findProfileConfigEl();
  if (profileConfigEl) {
    profileConfigEl.style.transform = 'translateX(0%) translateZ(1px)';
  }
  document.querySelector('#🖕📘⚙️🗄️')?.classList.remove('slide-left-to-show');
};

const slideProfileDrawer = () => {
  const profileConfigEl = findProfileConfigEl();
  if (profileConfigEl) {
    profileConfigEl.style.transform = 'translateX(-100%) translateZ(1px)';
  }
  document.querySelector('#🖕📘⚙️🗄️')?.classList.add('slide-left-to-show');
};

const createConfListItem = (id, text) => $el('div', {
  'data-visualcompletion': 'ignore-dynamic',
  'role': 'listitem',
  'class': 'px-8',
}, (el) => {
  el.innerHTML = `
<input id="${ id }" type="checkbox" hidden checked/>
<label for="${ id }" class="align-stretch bg-transparent border-ado border-solid border-0 border-box cursor-pointer flex-basis-auto list-none m-0 min-h-0 min-w-0 p-0 relative text-align-inherit no-underline touch-manipulation z-0 flex-row select-none outline-none rounded-8 block" tabindex="0">
  <div class="border-solid border-0 border-box flex justify-space-between m-0 min-w-0 py-0 px-8 relative z-0 items-center flex-row min-h-44">
    <div class="flex flex-column mr-12 my-8 relative align-self-start">
      <div class="rounded-50p items-center border-0 border-box inline-flex justify-center relative bg-btn-2 h-36 w-36">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="text-green-500 check-circle-rounded iconify iconify--material-symbols" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"></path></svg>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="text-red-500 cancel-rounded iconify iconify--material-symbols" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M7.7 16.3q.275.275.7.275q.425 0 .7-.275l2.9-2.9l2.925 2.925q.275.275.688.262q.412-.012.687-.287q.275-.275.275-.7q0-.425-.275-.7L13.4 12l2.925-2.925q.275-.275.262-.688q-.012-.412-.287-.687q-.275-.275-.7-.275q-.425 0-.7.275L12 10.6L9.075 7.675Q8.8 7.4 8.388 7.412q-.413.013-.688.288q-.275.275-.275.7q0 .425.275.7l2.9 2.9l-2.925 2.925q-.275.275-.262.687q.012.413.287.688ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"></path></svg>
      </div>
    </div>
    <div class="border-solid border-0 border-box flex flex-1 justify-space-between m-0 min-h-0 min-w-0 p-0 z-0 items-center flex-row relative">
      <div class="align-stretch border-solid border-0 border-box flex flex-column flex-1 justify-space-between m-0 min-h-0 min-w-0 px-0 relative z-0 py-12">
        <div class="flex flex-column -my-5">
          <div class="my-5">
            <span class="max-w-full min-w-0 break-word default-font block text-base line-height-four-third font-medium primary-text text-left" dir="auto">
            ${ text }
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="rounded-inherit inset-0 absolute transition-ho" data-visualcompletion="ignore"></div>
</label>
`;
});


const confDrawerEl = $el('div', {
  'id': '🖕📘⚙️🗄️',
  'class': 'border-box z-0 opacity-0 transition-duration-fast transition-timing-soft absolute left-0 w-full',
  'aria-hidden': 'true',
  'style': 'transition-property: opacity, transform; transform: translateX(100%) translateZ(1px);',
}, (confDrawerEl) => {
  confDrawerEl.innerHTML = `
<div class="flex-column flex">
  <div class="p-16 pb-8 flex-row flex">
    <div id="🖕📘⚙️🗄️🤏" class="p-8">
      <div aria-label="返回" class="align-stretch border-ado border-box cursor-pointer flex-basis-auto list-none min-h-0 min-w-0 text-align-inherit no-underline touch-manipulation z-0 rounded-inherit flex-row select-none outline-none appearance-none bg-transparent border-solid border-0 inline-flex m-0 p-0 relative vertical-align-bottom" role="button" tabindex="0">
        <i data-visualcompletion="css-img" class="icon-compat left-arrow-20 filter-primary-icon"></i>
        <div class="inset-0 absolute transition-ho rounded-50p" data-visualcompletion="ignore" style="inset: -8px;"></div>
      </div>
    </div>
    <div class="pl-10 flex items-center">
      <h2 class="color-inherit font-size-inherit font-weight-inherit outline-none max-w-full min-w-0" dir="auto">
        <span class="max-w-full min-w-0 break-word default-font block text-2xl line-height-seven-sixth font-bold primary-text" dir="auto">
        ${ $t('settingsTitle') }
        </span>
      </h2>
    </div>
  </div>
  <div class="pl-0 pb-24 pr-0 pt-8">
    <div class="-mb-16 -mt-4" role="list">
      <!-- placeholder -->
    </div>
  </div>
</div>
`;

  confDrawerEl.querySelector('#🖕📘⚙️🗄️🤏').onclick = resetProfileDrawer;

  // no sponsors
  {
    const noSponsorListItemEl = createConfListItem('🖕📘⚙️-no-sponsors', $t('fuckSponsors'));
    confDrawerEl.querySelector('[role="list"]')?.appendChild(noSponsorListItemEl);
    const checkboxEl = noSponsorListItemEl.querySelector('input[type="checkbox"]');
    checkboxEl.checked = Boolean(config.NO_SPONSORS);
    checkboxEl.onchange = () => {
      config.NO_SPONSORS = checkboxEl.checked ? 1 : 0;
      saveConf(config);
    };
  }

  // no friends recommendation
  {
    const noFriendsRecommendationListItemEl = createConfListItem('🖕📘⚙️-no-friends-recommendation', $t('fuckFriendsRecommendation'));
    confDrawerEl.querySelector('[role="list"]')?.appendChild(noFriendsRecommendationListItemEl);
    const checkboxEl = noFriendsRecommendationListItemEl.querySelector('input[type="checkbox"]');
    checkboxEl.checked = Boolean(config.NO_FRIENDS_RECOMMENDATION);
    checkboxEl.onchange = () => {
      config.NO_FRIENDS_RECOMMENDATION = checkboxEl.checked ? 1 : 0;
      saveConf(config);
    };
  }

  // no posts recommendation
  {
    const noPostsRecommendationListItemEl = createConfListItem('🖕📘⚙️-no-posts-recommendation', $t('fuckPostsRecommendation'));
    confDrawerEl.querySelector('[role="list"]')?.appendChild(noPostsRecommendationListItemEl);
    const checkboxEl = noPostsRecommendationListItemEl.querySelector('input[type="checkbox"]');
    checkboxEl.checked = Boolean(config.NO_POSTS_RECOMMENDATION);
    checkboxEl.onchange = () => {
      config.NO_POSTS_RECOMMENDATION = checkboxEl.checked ? 1 : 0;
      saveConf(config);
    };
  }
});

sentinel.on('#ssrb_top_nav_start ~ div [style*="translateZ"]:first-child', (profileConfigEl) => {
  if (profileConfigEl.querySelector('[href="/messages/t/"]')) { return; }
  profileConfigEl.insertAdjacentElement('afterend', confDrawerEl);
});

const confButtonEl = $el('div', {
  'id': '🖕📘⚙️',
  'data-visualcompletion': 'ignore-dynamic',
  'class': 'px-8',
}, (confButtonEl) => {
  confButtonEl.onclick = slideProfileDrawer;
  confButtonEl.innerHTML = `
<div class="bg-transparent border-ado border-solid border-0 border-box cursor-pointer list-none m-0 min-h-0 min-w-0 p-0 relative text-align-inherit no-underline touch-manipulation z-0 flex-row outline-none select-none rounded-8 block" role="button" tabindex="0">
  <div class="border-solid border-0 border-box flex flex-1 justify-space-between m-0 min-w-0 py-0 relative z-0 items-center flex-row px-8 min-h-44">
    <div class="flex flex-column mr-12 my-8 relative align-self-start">
      <div class="rounded-50p items-center border-0 border-box inline-flex justify-center relative bg-btn-2" style="height: 36px; width: 36px;">
        <i id="🖕📘⚙️-icon"></i>
      </div>
    </div>
    <div class="border-solid border-0 border-box flex flex-1 justify-space-between m-0 min-h-0 min-w-0 p-0 z-0 items-center flex-row relative">
      <div class="items-stretch border-solid border-0 border-box flex flex-column flex-1 flex-basis-0 justify-space-between m-0 min-h-0 min-w-0 px-0 relative z-0 py-12">
        <div class="">
          <div class="flex flex-column -my-5">
            <div class="my-5">
              <span class="max-w-full min-w-0 break-word default-font block font-medium primary-text text-left" style="font-size: .9375rem; line-height: 1.3333;" dir="auto">
              ${ $t('settingsTitle') }
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="my-12 ml-12 relative align-self-start">
        <div class="items-center flex flex-row">
          <div class="flex">
            <i data-visualcompletion="css-img" class="icon-compat chevron-right-24 filter-secondary-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="rounded-inherit inset-0 absolute transition-ho hover-to-show" data-visualcompletion="ignore"></div>
</div>
`;
});

sentinel.on('[data-visualcompletion="ignore-dynamic"] + hr + div [role="list"]>[data-visualcompletion="ignore-dynamic"][role="listitem"]:first-child', (accountDrawerFirstListItemEl) => {
  accountDrawerFirstListItemEl.insertAdjacentElement('beforebegin', confButtonEl);
  resetProfileDrawer();
});

$el('style', { id: '🖕📘-style' }, (el) => {
  document.head.appendChild(el);
  el.textContent = `
#🖕📘⚙️-icon {
  background-image: url(https://static.xx.fbcdn.net/images/emoji.php/v9/tfe/1/32/1f4a9.png);
  background-position: initial;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  height: 20px;
  width: 20px;
}
input[id^="🖕📘⚙️"]:not(:checked) + [for^="🖕📘⚙️"] .check-circle-rounded,
input[id^="🖕📘⚙️"]:checked + [for^="🖕📘⚙️"] .cancel-rounded {
  display: none;
}
`;
});

$el('style', { id: '🖕📘-style-util' }, (el) => {
  document.head.appendChild(el);
  el.textContent = `
.__fb-dark-mode:root, .__fb-dark-mode {
  --fuck-facebook-hover-overlay: #4e4e4f;
}
:root, .__fb-light-mode {
  --fuck-facebook-hover-overlay: #d8dadf;
}

/** atomic utilities **/

.relative { position: relative; }
.absolute { position: absolute; }

.flex { display: flex; }
.block { display: block; }
.inline-flex { display: inline-flex; }
.inline-block { display: inline-block; }

.flex-1 { flex: 1; }
.flex-row { flex-direction: row;}
.flex-column { flex-direction: column;}
.flex-basis-0 { flex-basis: 0px; }
.items-center { align-items: center; }
.items-stretch { align-items: stretch; }
.align-self-start { align-self: flex-start; }
.justify-center { justify-content: center; }
.justify-space-between { justify-content: space-between; }

.p-0 { padding: 0; }
.p-8 { padding: 8px; }
.p-16 { padding: 16px; }
.px-0 { padding-left: 0; padding-right: 0; }
.px-8 { padding-left: 8px; padding-right: 8px; }
.px-32 { padding-left: 32px; padding-right: 32px; }
.px-60 { padding-left: 60px; padding-right: 60px; }
.py-0 { padding-top: 0; padding-bottom: 0; }
.py-12 { padding-top: 12px; padding-bottom: 12px; }
.py-16 { padding-top: 16px; padding-bottom: 16px; }
.pb-24 { padding-bottom: 24px; }
.pl-10 { padding-left: 10px; }

.m-0 { margin: 0; }
.-my-5 { margin-top: -5px; margin-bottom: -5px; }
.my-5 { margin-top: 5px; margin-bottom: 5px; }
.my-8 { margin-top: 8px; margin-bottom: 8px; }
.my-12 { margin-top: 12px; margin-bottom: 12px; }
.ml-12 { margin-left: 12px; }
.mr-12 { margin-right: 12px; }
.-mb-16 { margin-bottom: -16px; }
.-mt-4 { margin-top: -4px; }


.inset-0 { top: 0px; right: 0px; bottom: 0px; left: 0px; }
.left-0 { left: 0; }

.rounded-8 { border-radius: 8px; }
.rounded-50p { border-radius: 50%; }
.border-0 { border-width: 0; }
.border-solid { border-style: solid; }
.bg-transparent { background-color: transparent; }
.border-box { box-sizing: border-box; }

.w-36 { width: 36px; }
.h-36 { height: 36px; }
.w-full { width: 100%; }
.min-h-0 { min-height: 0; }
.min-h-44 { min-height: 44px; }
.min-h-100vh { min-height: 100vh; }
.min-w-0 { min-width: 0; }
.max-w-full { max-width: 100%; }

.break-word { word-break: break-word; word-wrap: break-word; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.line-height-seven-sixth { line-height: 1.1667; }
.text-2xl { font-size: 1.5rem; /* 24px */ }
.text-base { font-size: 1rem; /* 16px */ }
.text-left { text-align: left; }
.text-green-500 { color: rgb(34 197 94); }
.text-red-500 { color: rgb(239 68 68); }

.z-0 { z-index: 0; }
.overflow-hidden { overflow: hidden; }

.cursor-pointer { cursor: pointer; }
.touch-manipulation { touch-action: manipulation; }

.no-underline, .no-underline:hover { text-decoration: none; }
.outline-none { outline: none; }
.pointer-events-none { pointer-events: none; }
.list-none { list-style-type: none; }
.select-none { user-select: none; -moz-user-select: none; }
.opacity-0 { opacity: 0; }

.vertical-align-bottom { vertical-align: bottom; }

.rounded-inherit { border-radius: inherit; }
.text-align-inherit { text-align: inherit; }
.color-inherit { color: inherit; }
.font-size-inherit { font-size: inherit; }
.font-weight-inherit { font-weight: inherit; }


/** with variables **/

.border-ado { border-color: var(--always-dark-overlay); }
.bgc-ho2:hover { background-color: var(--fuck-facebook-hover-overlay) }
.transition-ho {
  transition-duration: var(--fds-duration-extra-extra-short-out);
  transition-property: opacity;
  transition-timing-function: var(--fds-animation-fade-out);
  background-color: var(--hover-overlay);
}
.bg-card { background-color: var(--card-background); }
.bg-btn-2 { background-color: var(--secondary-button-background); }
.default-font { font-family: var(--font-family-default); }
.primary-text { color: var(--primary-text); }
.secondary-text { color: var(--secondary-text); }

.filter-primary-icon {
  filter: var(--filter-primary-icon);
}
.filter-secondary-icon {
  filter: var(--filter-secondary-icon);
}
.transition-duration-fast {
  transition-duration: var(--fds-fast);
}
.transition-timing-soft {
	transition-timing-function: var(--fds-soft);
}

/** self defined **/

.icon-compat {
  background-image: url("https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/pX1dNHbjZEM.png");
  background-size: auto;
  background-repeat: no-repeat;
  display: inline-block;
}
.icon-compat.left-arrow-20 {
  background-position: -25px -46px;
  width: 20px;
  height: 20px;
}
.icon-compat.chevron-right-24 {
  background-position: -108px -13px;
  width: 24px;
  height: 24px;
}
[id^="🖕📘"] [data-visualcompletion="ignore"] {
  opacity: 0;
}
[id^="🖕📘"] [data-visualcompletion="ignore"]:hover {
  opacity: 1;
}
.slide-left-to-show {
  transform: translateX(0%) translateZ(1px) !important;
  opacity: 1 !important;
}
`;
});
