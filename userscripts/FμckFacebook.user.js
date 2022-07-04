// ==UserScript==
// @name         Fμck Facebook
// @namespace    https://github.com/FlandreDaisuki
// @version      1.4.4
// @description  Remove all Facebook shit
// @author       FlandreDaisuki
// @match        https://*.facebook.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
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
        fuckInstagram: '不要 Instagram',
        fuckVideoChat: '不要視訊圈',
        fuckLeftNavigationColumn: '不要左引導欄',
        fuckRightContactColumn: '不要右聯絡欄',
      };
    default:
      return {
        settingsTitle: 'Fμck Facebook',
        fuckSponsors: 'Fμck off sponsors',
        fuckFriendsRecommendation: 'Fμck off friends recommendation',
        fuckPostsRecommendation: 'Fμck off posts recommendation',
        fuckInstagram: 'Fμck off Instagram',
        fuckVideoChat: 'Fμck off Video Chat',
        fuckLeftNavigationColumn: 'Fμck off Left Navigation Column',
        fuckRightContactColumn: 'Fμck off Right Contact Column',
      };
  }
})(document.documentElement.lang);

const $t = (keyPath) => LOCALE_DICT[keyPath] ?? keyPath;
const noop = () => {};
const $el = (tag, attrs = {}, callback = noop) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  callback(el);
  return el;
};

const DEFAULT_CONF = Object.freeze({
  NO_SPONSORS: 1,
  NO_FRIENDS_RECOMMENDATION: 1,
  NO_POSTS_RECOMMENDATION: 1,
  NO_INSTAGRAM: 1,
  NO_VIDEO_CHAT: 1,
  NO_LEFT_NAVIGATION_COLUMN: 1,
  NO_RIGHT_CONTACT_COLUMN: 1,
});

const configKeyToCheckboxElDict = Object.create(null);

const config = new Proxy({ ...DEFAULT_CONF }, {
  set: (obj, prop, val) => {
    Reflect.set(obj, prop, val);
    for (const [k, v] of Object.entries(obj)) {
      const checkboxEl = configKeyToCheckboxElDict[k];
      if (checkboxEl) {
        checkboxEl.checked = Boolean(v);
      }
    }
    GM.setValue(GM_info.script.version, obj);
    return true;
  },
});

const saveConf = async(conf) => {
  if (GM_setValue) {
    return GM_setValue(GM_info.script.version, conf);
  }
  return GM.setValue(GM_info.script.version, conf);
};

const loadConf = async() => {
  let conf;
  if (GM_getValue) {
    conf = GM_getValue(GM_info.script.version);
  }
  else {
    conf = await GM.getValue(GM_info.script.version);
  }
  if (!conf) {
    Object.assign(config, DEFAULT_CONF);
  }
  Object.assign(config, conf);
};

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

  const feedRootEl = recommendPostsEl.closest('[role="article"]')?.closest('.k4urcfbm');

  /* eslint-disable-next-line no-console */
  console.count('🖕📘 NO_POSTS_RECOMMENDATION');
  feedRootEl.hidden = true;
});

/* Feature 4: FaceBullshit */
const FaceBullshitStyleEl = $el('style', { id: '🖕📘🐂💩' }, (el) => document.head.appendChild(el));
const renderFaceBullshitStyle = () => {
  FaceBullshitStyleEl.textContent = `
  /* 本樣式 logo */
  [aria-label="Facebook"][role="link"]::before {
    content: 'facebullshit';
    display: block;
    color: transparent;
    font-size: 2rem;
    --logo: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 1764 392'%3E %3Cpath d='M 34.00,159.00 C 34.00,159.00 7.00,159.00 7.00,159.00 7.00,159.00 7.00,195.00 7.00,195.00 7.00,195.00 33.00,195.00 33.00,195.00 35.12,221.16 34.00,247.73 34.00,274.00 34.00,283.62 34.87,310.31 33.00,318.00 33.00,318.00 51.00,319.00 51.00,319.00 51.00,319.00 82.00,319.00 82.00,319.00 82.00,319.00 82.00,195.00 82.00,195.00 82.00,195.00 118.00,195.00 118.00,195.00 118.00,195.00 118.00,159.00 118.00,159.00 118.00,159.00 82.00,159.00 82.00,159.00 82.00,144.04 78.39,124.28 96.00,117.56 98.55,116.59 101.28,116.16 104.00,116.04 113.15,115.64 115.91,117.76 124.00,119.00 124.00,119.00 124.00,90.00 124.00,90.00 124.00,87.92 124.23,84.26 122.98,82.56 120.68,79.46 108.82,79.01 105.00,79.00 92.54,78.98 83.10,78.75 71.00,83.09 53.48,89.38 39.65,103.71 35.43,122.00 33.32,131.11 34.09,138.78 34.00,148.00 33.95,151.95 33.11,155.18 34.00,159.00 Z M 642.00,82.00 C 642.00,82.00 642.00,319.00 642.00,319.00 642.00,319.00 690.00,319.00 690.00,319.00 690.00,319.00 690.00,300.00 690.00,300.00 690.00,300.00 703.00,312.48 703.00,312.48 711.86,319.45 719.19,321.01 730.00,322.16 733.10,322.50 734.72,323.05 738.00,322.82 758.01,321.40 773.38,315.60 786.79,300.00 803.40,280.69 807.18,255.55 807.00,231.00 806.84,209.29 800.82,184.15 784.00,169.18 772.89,159.31 759.41,156.21 745.00,155.18 741.72,154.95 740.10,155.50 737.00,155.84 723.40,157.29 713.72,160.47 703.01,169.46 703.01,169.46 690.00,183.00 690.00,183.00 690.00,183.00 690.00,82.00 690.00,82.00 690.00,82.00 642.00,82.00 642.00,82.00 Z M 1034.00,82.00 C 1034.00,82.00 1034.00,319.00 1034.00,319.00 1034.00,319.00 1082.00,319.00 1082.00,319.00 1082.00,319.00 1082.00,82.00 1082.00,82.00 1082.00,82.00 1034.00,82.00 1034.00,82.00 Z M 1125.00,319.00 C 1125.00,319.00 1173.00,319.00 1173.00,319.00 1173.00,319.00 1173.00,91.00 1173.00,91.00 1173.00,88.70 1173.38,84.59 1171.40,83.02 1169.60,81.60 1163.41,82.00 1161.00,82.00 1161.00,82.00 1134.00,82.00 1134.00,82.00 1127.26,82.01 1125.14,81.51 1125.00,89.00 1125.00,89.00 1125.00,137.00 1125.00,137.00 1125.00,137.00 1125.00,319.00 1125.00,319.00 Z M 1357.00,82.00 C 1357.00,82.00 1357.00,319.00 1357.00,319.00 1357.00,319.00 1405.00,319.00 1405.00,319.00 1405.00,319.00 1405.00,229.00 1405.00,229.00 1405.03,209.75 1414.86,192.76 1436.00,193.00 1441.05,193.06 1444.74,193.91 1448.99,196.85 1458.00,203.08 1460.88,215.64 1461.00,226.00 1461.00,226.00 1461.00,319.00 1461.00,319.00 1461.00,319.00 1509.00,319.00 1509.00,319.00 1509.00,319.00 1509.00,243.00 1509.00,243.00 1509.00,229.22 1509.81,208.98 1506.63,196.00 1500.68,171.77 1488.63,158.30 1463.00,155.93 1459.85,155.63 1457.20,154.96 1454.00,155.18 1441.68,156.06 1429.66,159.28 1420.00,167.32 1420.00,167.32 1405.00,183.00 1405.00,183.00 1405.00,183.00 1405.00,91.00 1405.00,91.00 1405.00,91.00 1403.40,83.02 1403.40,83.02 1403.40,83.02 1391.00,82.00 1391.00,82.00 1391.00,82.00 1357.00,82.00 1357.00,82.00 Z M 1570.00,83.43 C 1562.39,84.70 1555.75,86.64 1550.79,93.09 1547.22,97.72 1546.01,102.26 1546.01,108.00 1546.01,123.16 1557.28,132.82 1572.00,133.00 1578.77,133.08 1583.95,133.03 1590.00,129.39 1603.32,121.38 1605.81,102.19 1594.90,91.09 1588.40,84.48 1579.00,82.34 1570.00,83.43 Z M 1652.00,124.00 C 1652.00,124.00 1652.00,159.00 1652.00,159.00 1652.00,159.00 1626.00,159.00 1626.00,159.00 1626.00,159.00 1626.00,195.00 1626.00,195.00 1626.00,195.00 1652.00,195.00 1652.00,195.00 1652.00,195.00 1652.00,260.00 1652.00,260.00 1652.00,275.92 1651.32,291.13 1660.90,305.00 1669.83,317.92 1682.52,320.72 1697.00,322.17 1697.00,322.17 1704.00,322.92 1704.00,322.92 1704.00,322.92 1714.00,322.01 1714.00,322.01 1718.52,321.85 1732.36,320.22 1734.98,316.49 1736.23,314.71 1736.00,311.14 1736.00,309.00 1736.00,309.00 1736.00,281.00 1736.00,281.00 1722.37,286.75 1706.80,288.44 1701.22,271.00 1699.95,267.04 1700.01,264.07 1700.00,260.00 1700.00,260.00 1700.00,195.00 1700.00,195.00 1700.00,195.00 1736.00,195.00 1736.00,195.00 1736.00,195.00 1736.00,159.00 1736.00,159.00 1736.00,159.00 1700.00,159.00 1700.00,159.00 1700.00,159.00 1700.00,111.00 1700.00,111.00 1700.00,111.00 1652.00,124.00 1652.00,124.00 Z M 147.00,205.00 C 164.23,195.78 172.74,190.54 193.00,188.92 196.28,188.65 198.63,187.94 202.00,188.18 212.63,188.94 223.05,192.36 227.52,203.00 228.69,205.77 230.82,211.78 228.39,214.26 226.64,216.04 222.42,216.08 220.00,216.42 220.00,216.42 201.00,219.00 201.00,219.00 175.04,222.55 144.93,224.93 134.55,254.00 126.90,275.38 131.59,303.02 152.00,315.53 164.38,323.13 182.12,324.03 196.00,320.76 212.50,316.88 218.66,307.95 229.00,296.00 230.18,304.95 230.43,308.93 229.00,318.00 229.00,318.00 246.00,319.00 246.00,319.00 246.00,319.00 275.00,319.00 275.00,319.00 275.00,319.00 275.00,222.00 275.00,222.00 274.81,206.30 271.69,188.49 261.53,176.00 242.09,152.07 203.37,152.90 176.00,159.12 176.00,159.12 156.00,164.69 156.00,164.69 153.43,165.61 149.52,166.86 148.02,169.27 146.79,171.26 147.00,174.70 147.00,177.00 147.00,177.00 147.00,205.00 147.00,205.00 Z M 435.00,275.00 C 422.92,279.43 417.29,284.83 403.00,285.00 387.59,285.18 376.05,283.26 365.18,271.00 347.00,250.48 352.22,211.63 377.00,198.32 389.41,191.66 406.85,191.23 420.00,195.86 426.74,198.24 429.02,200.12 435.00,203.00 435.00,203.00 435.00,171.00 435.00,171.00 435.00,169.07 435.12,165.84 434.40,164.11 432.43,159.32 423.58,158.05 419.00,157.25 406.66,155.10 389.36,154.66 377.00,156.59 342.47,161.99 315.70,182.84 308.21,218.00 307.11,223.16 306.07,228.73 306.00,234.00 306.00,234.00 306.00,248.00 306.00,248.00 306.04,271.31 317.17,293.43 336.00,307.24 357.30,322.86 384.71,324.68 410.00,321.13 415.34,320.38 431.16,317.28 433.98,312.73 435.21,310.74 435.00,307.30 435.00,305.00 435.00,305.00 435.00,275.00 435.00,275.00 Z M 598.00,311.00 C 597.12,299.41 595.93,287.53 598.00,276.00 598.00,276.00 580.00,283.92 580.00,283.92 573.96,285.99 563.38,287.92 557.00,288.00 538.85,288.21 521.48,286.79 511.53,269.00 508.67,263.90 508.03,258.63 507.00,253.00 507.00,253.00 612.00,253.00 612.00,253.00 612.00,253.00 612.00,238.00 612.00,238.00 611.98,226.50 609.51,207.72 605.47,197.00 594.16,166.99 570.75,157.30 541.00,155.18 537.58,154.94 536.16,155.53 533.00,155.83 518.39,157.25 506.36,159.77 494.00,168.44 482.46,176.54 473.17,187.11 467.31,200.00 462.02,211.64 461.02,220.62 459.87,233.00 458.79,243.93 459.19,239.73 459.87,250.00 461.85,277.67 471.32,299.74 497.00,313.36 509.51,319.99 519.38,320.87 533.00,322.17 536.48,322.50 538.21,323.08 542.00,322.96 542.00,322.96 550.00,322.09 550.00,322.09 571.32,320.63 578.08,319.57 598.00,311.00 Z M 1205.00,276.00 C 1205.00,276.00 1205.00,297.00 1205.00,297.00 1205.00,297.00 1205.66,306.00 1205.66,306.00 1205.66,306.00 1205.00,315.00 1205.00,315.00 1205.00,315.00 1228.00,320.57 1228.00,320.57 1228.00,320.57 1246.00,322.09 1246.00,322.09 1246.00,322.09 1254.00,322.92 1254.00,322.92 1254.00,322.92 1262.00,322.09 1262.00,322.09 1286.42,320.38 1316.08,312.12 1324.64,286.00 1326.54,280.19 1327.07,274.07 1327.00,268.00 1326.68,239.76 1305.09,230.50 1282.00,222.05 1273.30,218.87 1254.93,214.42 1252.98,204.00 1251.44,195.74 1261.41,190.86 1268.00,189.45 1285.41,185.75 1302.27,192.23 1318.00,199.00 1318.00,199.00 1317.00,170.00 1317.00,170.00 1317.00,167.87 1317.23,164.27 1315.98,162.51 1314.38,160.26 1309.58,159.54 1307.00,159.00 1307.00,159.00 1290.00,156.00 1290.00,156.00 1290.00,156.00 1282.00,156.00 1282.00,156.00 1256.81,153.43 1221.77,161.07 1209.79,186.00 1207.19,191.39 1206.08,195.01 1206.00,201.00 1205.92,207.89 1205.47,215.38 1207.44,222.00 1212.55,239.16 1229.39,247.43 1245.00,253.32 1254.70,256.97 1275.20,261.57 1279.68,271.00 1282.13,276.15 1279.16,281.24 1274.96,284.35 1270.09,287.96 1257.00,290.24 1251.00,289.82 1242.96,289.25 1231.51,287.04 1224.00,284.19 1224.00,284.19 1205.00,276.00 1205.00,276.00 Z M 838.00,159.00 C 838.00,159.00 838.00,234.00 838.00,234.00 838.00,249.86 836.87,267.62 840.74,283.00 846.91,307.46 860.77,320.07 886.00,322.08 889.05,322.33 890.86,322.91 894.00,322.68 908.23,321.61 920.32,317.99 930.91,307.83 930.91,307.83 943.00,294.00 943.00,294.00 943.00,294.00 943.00,319.00 943.00,319.00 943.00,319.00 991.00,319.00 991.00,319.00 991.00,319.00 991.00,159.00 991.00,159.00 991.00,159.00 943.00,159.00 943.00,159.00 943.00,159.00 943.00,250.00 943.00,250.00 942.99,259.53 941.48,267.33 935.32,274.96 926.54,285.84 908.39,288.91 897.09,280.21 888.88,273.90 886.12,262.88 886.00,253.00 886.00,253.00 886.00,159.00 886.00,159.00 886.00,159.00 838.00,159.00 838.00,159.00 Z M 1549.00,159.00 C 1549.00,159.00 1549.00,319.00 1549.00,319.00 1549.00,319.00 1598.00,319.00 1598.00,319.00 1598.00,319.00 1598.00,159.00 1598.00,159.00 1598.00,159.00 1549.00,159.00 1549.00,159.00 Z M 567.00,223.00 C 567.00,223.00 507.00,223.00 507.00,223.00 507.51,212.00 513.20,200.26 522.00,193.53 532.40,185.57 550.57,186.06 559.47,196.18 565.32,202.84 566.92,214.41 567.00,223.00 Z M 717.00,193.32 C 725.82,192.36 735.48,192.48 743.00,197.80 753.78,205.43 755.96,216.89 757.17,229.00 759.09,248.24 755.02,275.95 734.00,283.45 729.20,285.17 725.00,285.05 720.00,285.00 699.28,284.75 689.22,266.80 689.00,248.00 688.74,225.36 689.64,199.47 717.00,193.32 Z M 230.00,243.00 C 230.00,251.12 230.61,259.19 227.90,267.00 219.87,290.11 192.54,292.93 181.33,282.47 172.79,274.51 172.83,256.06 189.00,249.45 194.38,247.26 199.30,246.59 205.00,245.95 205.00,245.95 230.00,243.00 230.00,243.00 Z' /%3E%3C/svg%3E");
    mask: var(--logo) no-repeat;
    mask-size: 100% 100%;
    -webkit-mask: var(--logo) no-repeat;
    -webkit-mask-size: 100% 100%;
    background-color: var(--fb-wordmark);
  }
  [aria-label="Facebook"][role="link"] > svg {
    display: none;
  }
  /* 頭像右下的髒東西 */
  svg[role="img"] ~ div svg,
  svg[role="img"] circle[data-visualcompletion="ignore"] {
    display: none;
  }

  /* 自訂聊天室高度 */
  [data-testid="mwchat-tab"] {
    height: 98.5vh;
  }

  /* 不要左引導欄 */
  ${ config.NO_LEFT_NAVIGATION_COLUMN ? `
  #ssrb_left_rail_start ~ [role="navigation"] {
    display: none;
  }
  ` : '' }

  /* 不要右聯絡欄 */
  ${ config.NO_RIGHT_CONTACT_COLUMN ? `
  #ssrb_left_rail_start ~ [role="complementary"] {
    display: none;
  }
  ` : '' }

  /* 不要 instagram */
  ${ config.NO_INSTAGRAM ? `
  #ssrb_stories_start + div {
    display: none;
  }
  #ssrb_left_rail_start ~ [role="main"] .l6v480f0 {
    border-top: none;
  }
  /* m.facebook.com */
  #MStoriesTray {
    display: none;
  }
  ` : '' }

  /* 不要視訊圈 */
  ${ config.NO_VIDEO_CHAT ? `
  #ssrb_composer_start + div + div + div {
    display: none;
  }
  ` : '' }
`;
};

/* Feature 4: 以上皆可個別設定 */

const findProfileConfigEl = () => {
  return [...document.querySelectorAll('#ssrb_top_nav_start ~ div [style*="translateZ"]:not([data-visualcompletion="ignore"])')].filter((el) => {
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

  const renderConfListItem = (id, i18nKey, configKey) => {
    const listItemEl = createConfListItem(id, $t(i18nKey));
    confDrawerEl.querySelector('[role="list"]')?.appendChild(listItemEl);
    const checkboxEl = listItemEl.querySelector('input[type="checkbox"]');
    configKeyToCheckboxElDict[configKey] = checkboxEl;
    checkboxEl.checked = Boolean(config[configKey]);
    checkboxEl.onchange = () => {
      config[configKey] = checkboxEl.checked ? 1 : 0;
      saveConf(config).then(renderFaceBullshitStyle);
    };
  };

  renderConfListItem('🖕📘⚙️-no-sponsors', 'fuckSponsors', 'NO_SPONSORS');
  renderConfListItem('🖕📘⚙️-no-friends-recommendation', 'fuckFriendsRecommendation', 'NO_FRIENDS_RECOMMENDATION');
  renderConfListItem('🖕📘⚙️-no-posts-recommendation', 'fuckPostsRecommendation', 'NO_POSTS_RECOMMENDATION');
  renderConfListItem('🖕📘⚙️-no-instagram', 'fuckInstagram', 'NO_INSTAGRAM');
  renderConfListItem('🖕📘⚙️-no-video-chat', 'fuckVideoChat', 'NO_VIDEO_CHAT');
  renderConfListItem('🖕📘⚙️-no-left-navigation-column', 'fuckLeftNavigationColumn', 'NO_LEFT_NAVIGATION_COLUMN');
  renderConfListItem('🖕📘⚙️-no-right-contact-column', 'fuckRightContactColumn', 'NO_RIGHT_CONTACT_COLUMN');
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

sentinel.on('.b20td4e0.muag1w35[role="list"]>[data-visualcompletion="ignore-dynamic"][role="listitem"]:first-child', (accountDrawerFirstListItemEl) => {
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

/* main */
loadConf().then(renderFaceBullshitStyle);
