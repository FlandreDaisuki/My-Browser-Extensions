// ==UserScript==
// @name         javbus.waterfall
// @namespace    https://github.com/FlandreDaisuki
// @description  Infinite scroll @ javbus.com
// @version      2020.04.21
// @author       FlandreDaisuki
// @include      *://*.javbus.*/*
// @grant        none
// @license      MIT
// @noframes
// ==/UserScript==

// test URLs
// https://www.javbus.com/actresses
// https://www.javbus.com/actresses/2

// https://www.javbus.com/uncensored/actresses
// https://www.javbus.com/uncensored/actresses/2

// https://www.javbus.com/star/1fw
// https://www.javbus.com/star/1fw/2

// https://www.javbus.com/genre/1
// https://www.javbus.com/genre/1/2

// https://www.javbus.com/uncensored
// https://www.javbus.com/uncensored/page/2

// https://www.javbus.com
// https://www.javbus.com/page/2

/* global jQuery */

// Configuration
const FETCH_TRIG = '400px';
const COL_CNT = 4;
const IS_DENSE = false;

// Utilities
const $ = jQuery;

const global = {
  pageCount: 0,
  itemCount: 0,
  $parent: $('#waterfall:not(.masonry)')[0] ? $('#waterfall:not(.masonry)') : $('#waterfall.masonry'),
  nextURL: location.href,
  locked: false,
  baseURI: location.origin,
  selector: {
    next: 'a#next',
    item: '.item',
  },
};

const itemTransform = (item) => {
  const $item = $(item);
  const title = $item.find('.photo-info > span')[0].firstChild.textContent.trim();
  const $itemTag = $item.find('.item-tag');
  const [serial, date] = $item.find('date').toArray().map(el => el.textContent);
  const isAvatarItem = $item.find('.avatar-box').length

  if($itemTag.find('.btn-primary')[0]) {
    $item.addClass('HD-torrent');
  }

  $item.removeAttr('style').removeClass('masonry-brick');
  if(isAvatarItem) {
    $item.find('.photo-info').empty()
      .append(`<h2>${title}</h2>`)
  } else {
    $item.find('.photo-info').empty()
    .append(`<div class="serial">${serial}</div>`)
    .append(`<h2>${title}</h2>`)
    .append($itemTag)
    .append(`<date>${date}</date>`);
  }
  return $item;
}

const getNextURL = (href) => {
  const a = document.createElement('a');
  a.href = href;
  return `${global.baseURI}${a.pathname}${a.search}`;
};

const fetchURL = async(url) => {
  console.log(`fetchUrl = ${url}`);

  const resp = await fetch(url, { credentials: 'same-origin' });
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const $doc = $(doc);

  const href = $doc.find(global.selector.next).attr('href');
  const nextURL = href ? getNextURL(href) : null;
  const $elems = $doc.find(global.selector.item);

  return {
    nextURL,
    $elems,
  };
};

const intersectionObserverOptions = {
  rootMargin: `0px 0px ${FETCH_TRIG} 0px`,
  threshold: Array(5).fill().map((_, index, arr) => index / arr.length),
};

const intersectionObserver = new IntersectionObserver(async() => {
  if (global.locked) { return; }
  global.locked = true;
  const { nextURL, $elems } = await fetchURL(global.nextURL);

  const items = $elems.toArray();
  if (location.pathname.includes('/star/')) {
    let avatarIdx = items.findIndex(item => item.querySelector('.avatar-box'))
    while(avatarIdx >= 0) {
      items.splice(avatarIdx, 1);
      avatarIdx = items.findIndex(item => item.querySelector('.avatar-box'))
    }
  }

  if(global.pageCount === 0) {
    global.$parent.empty();
  }
  global.$parent.append(items.map(itemTransform));
  global.itemCount += items.length;

  // finally
  global.pageCount += 1;
  global.nextURL = nextURL;
  global.locked = false;

  if (!global.nextURL) {
    console.info('The End');
    global.$parent.after($('<h1 id="end">The End</h1>'));
    intersectionObserver.disconnect();
    return;
  }
}, intersectionObserverOptions);

intersectionObserver.observe($('footer')[0]);

const addStyle = (styleStr) => {
  $('head').append(`<style>${styleStr}</style>`);
};

const SHARED_STYLE = `
:root {
  --info-title-height: 110px;
}
.ad-list {
  display: none !important;
}
#waterfall.masonry,
#waterfall.masonry > #waterfall {
  width: 100% !important;
  height: initial !important;
  margin: 0;
}
.photo-info > h2 {
  margin: 1rem 0;
  display: block;
  max-height: var(--info-title-height, 110px);
  overflow: hidden;
  position: relative;
  font-size: 1.6rem;
}
.photo-info > h2::after {
  --info-title-linear-gradient-height: 15px;
  content: '';
  display: block;
  height: var(--info-title-linear-gradient-height, 15px);
  width: 100%;
  position: absolute;
  top: calc(var(--info-title-height, 110px) - var(--info-title-linear-gradient-height, 15px));
  background: linear-gradient(#FFF0, #FFF);
}
.photo-info > .serial {
  text-shadow: 1px 1px 1px darkgray;
  text-decoration: underline double cadetblue;
}
#end {
  text-align: center;
}
`;

const isJavbusOrg = location.host === 'www.javbus.org'

const GRID_STYLE = `
#waterfall${isJavbusOrg ? '' : ':not(.masonry)'} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));
}
#waterfall${isJavbusOrg ? '' : ':not(.masonry)'} .item {
  display: grid;
  align-items: center;
  justify-content: stretch;
  position: relative !important;
  top: initial !important;
  left: initial !important;
  float: none !important;
}
.item > .movie-box {
  display: grid;
  grid-template-columns: minmax(30%, auto) 1fr;
  height: 95%;
  width: 95%;
}
.item > .movie-box > .photo-frame > .img {
  max-width: 100%;
  object-fit: contain;
}`;

const DENSE_STYLE = `
#waterfall:not(.masonry) {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: center;
}
.item {
  position: relative !important;
  top: initial !important;
  left: initial !important;
  float: none !important;
  margin: 0 auto;
}
`;

const STAR_STYLE = `
#waterfall:not(.masonry) {
  padding-left: 180px;
}
${
isJavbusOrg
  ? ''
  : `
#waterfall.masonry > .item {
  position: fixed !important;
  top: initial !important;
  left: initial !important;
}`
}
`;

const ACTRESS_STYLE = `
#waterfall.masonry {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  align-items: center;
}
#waterfall.masonry > .item {
  display: grid !important;
  align-items: center;
  justify-content: stretch;
  position: relative !important;
  top: initial !important;
  left: initial !important;
  float: none !important;
}
`;

addStyle(SHARED_STYLE);
addStyle(IS_DENSE ? DENSE_STYLE : GRID_STYLE);

if(location.pathname.includes('/star/')) {
  addStyle(STAR_STYLE);
}
if(location.pathname.includes('/actresses')) {
  addStyle(ACTRESS_STYLE);
}
