// ==UserScript==
// @name         Pixiv Auto Like
// @name:zh-TW   Pixiv 自動點讚
// @description        Click **like** automatically in new illust pages
// @description:zh-TW  在新版頁面自動點讚
// @namespace    https://github.com/FlandreDaisuki
// @version      1.0.1
// @author       FlandreDaisuki
// @include      *://www.pixiv.net/member_illust.php?*&mode=medium
// @include      *://www.pixiv.net/member_illust.php?mode=medium&*
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @noframes
// ==/UserScript==
/* eslint-disable no-restricted-globals, camelcase, no-param-reassign */
/* global globalInitData */

const liked = new Set();

// wait until React ready... fucking slow...
const tid = setInterval(() => {
  const h1Title = document.querySelector('figcaption > h1');
  if (h1Title) {
    clearInterval(tid);
    main(h1Title);
  }
}, 500);

function main(targetElement) {
  postLike();

  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };
  const observer = new MutationObserver(postLike);
  observer.observe(targetElement, config);
}

async function postLike() {
  const likeBtn = document.querySelector('button.Ki5EGTG');
  const likeSVG = document.querySelector('svg.v2zpsfm');
  const sp = new URLSearchParams(location.search);
  const illust_id = sp.get('illust_id');

  if (liked.has(illust_id)) {
    changeLikedStyle(likeBtn, likeSVG);
    return;
  }

  if (likeBtn && !likeBtn.classList.contains('_2iDv0r8')) {
    const resp = await fetch('/ajax/illusts/like', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': globalInitData.token,
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        illust_id,
      }),
    });

    const data = await resp.json();
    if (!data.error) {
      changeLikedStyle(likeBtn, likeSVG);
      liked.add(illust_id);
    }
  }
}

function changeLikedStyle(likeBtn, likeSVG) {
  if (likeBtn) {
    likeBtn.classList.add('_2iDv0r8');
  }
  if (likeSVG) {
    likeSVG.classList.add('_1YUwQdz');
    likeSVG.innerHTML = `
<path d="M5,7.08578644 L9.29289322,2.79289322 C9.68341751,2.40236893 10.3165825,2.40236893 10.7071068,
  2.79289322 C11.0976311,3.18341751 11.0976311,3.81658249 10.7071068,4.20710678 L5,9.91421356 L2.29289322,
  7.20710678 C1.90236893,6.81658249 1.90236893,6.18341751 2.29289322,5.79289322 C2.68341751,5.40236893 3.31658249,
  5.40236893 3.70710678,5.79289322 L5,7.08578644 Z"></path>`;
  }
}
