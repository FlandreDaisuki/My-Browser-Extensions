// ==UserScript==
// @name         Pixiv Auto Like
// @name:zh-TW   Pixiv 自動點讚
// @description        Click **like** automatically in new illust pages
// @description:zh-TW  在新版頁面自動點讚
// @namespace    https://github.com/FlandreDaisuki
// @version      1.2.1
// @author       FlandreDaisuki
// @include      *://www.pixiv.net/member_illust.php?*mode=medium*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACw0lEQVRYhe2YvU9TURjGDxGMX4lhZDK6ACGObv4BJixEggvuxNHJ3egKpb3FtooLpjAYXWyoyEAMCYNoYiLGQEKoiXyJQPko9D3nvI/DvdWCh9NzSYMdeJN3aNP79Hefc97n5F4hTitMecU2Eae8GCCcSMcpL7ximw1m+cRg/kItm6FO0hmTU//U/4Ip9SlQVYA8gugPOhp8DvtHXnBtSecojYpAUcKNlxILW4ylXcZ8ntE6LCGihDoHkLoBH6B1WOLbhq+xsMW49UZCxMICRQmjOQVTPf+q/DuuBNVPGJkza4zlNC4lXIE8ws3X0ihUqitD0r58HuH6iF3jzttDGkcCRQi/9tgqtrjDEBELUISQ27JrbBYZTSkXoD6C0naxbWKIXgtQL2GzaNdQzGhKOgIVpF1sfZ8h+ixAfYTVgl1jX7kCRQn3J82bsVS3s8o8KWUad8ftGo+mD2nYpuxskrBwxB6YXNQQcYcpixM+r2mjxuyGxuVnIXPo4lPCvfcaFGjuSaBrTOHMEweYoBsShK4xhd1g4EgDD6Y0LqQMv68EVLpLEfOXQMTIzZnjajgBlYt6QYeBCnOdM1Cc0Dgo0ZlV6JlQaE5L/0yqBNNPaE5L9EwodGYVGgelHSqMQ3ObGhzs8S9rjI5R5QejKa09gogQOkYVfuz4FzEDD6e1/Qx03UMtaQnmgxNXkEByRvtuRehAN6clUjMa6/sHJ+vDKuPaC4tLrg7VJ8xByQzsKWClAGRyjEyOsVLwvzMF/at5Rr1tQp2XzCN0v5NY2rUnr61WC4yW4QoHcqgpi/mZkv3O2CZ3sKJifPrJaEiQPdlDA5XlSXtGYj5vh9IMTC0x2jPSPb9CA5W5dXWI0D0uMbtRmiL+06QZjz8qnE85uFIVoHLHgtA7l/T7WOFZNaBqd+0D1dyjdM29bPgLVSOvY07LXL8BZ79TYIQHQXsAAAAASUVORK5CYII=
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @noframes
// ==/UserScript==
/* global globalInitData, sentinel */
const $ = (s) => document.querySelector(s);

sentinel.on('button._35vRH4a:not(._1vHxmVH)', async () => {
  const likeBtn = $('button._35vRH4a');
  const likeSVG = $('svg._3eF4D7o');
  const sp = new URLSearchParams(location.search);

  const resp = await fetch('/ajax/illusts/like', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-csrf-token': globalInitData.token,
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      illust_id: sp.get('illust_id'),
    }),
  });

  const data = await resp.json();
  if (!data.error) {
    changeLikedStyle(likeBtn, likeSVG);
  }
});

function changeLikedStyle(likeBtn, likeSVG) {
  if (likeBtn) {
    likeBtn.classList.add('_1vHxmVH');
  }
  if (likeSVG) {
    likeSVG.classList.add('_2sram-m');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('d', `M5,7.08578644 L9.29289322,2.79289322 C9.68341751,2.40236893 10.3165825,2.40236893 10.7071068,
    2.79289322 C11.0976311,3.18341751 11.0976311,3.81658249 10.7071068,4.20710678 L5,9.91421356 L2.29289322,
    7.20710678 C1.90236893,6.81658249 1.90236893,6.18341751 2.29289322,5.79289322 C2.68341751,5.40236893 3.31658249,
    5.40236893 3.70710678,5.79289322 L5,7.08578644 Z`);
    while (likeSVG.firstChild) {
      likeSVG.firstChild.remove();
    }
    likeSVG.appendChild(svgPath);
  }
}
