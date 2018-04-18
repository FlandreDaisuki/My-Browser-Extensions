// ==UserScript==
// @name         動畫瘋自動播放下一集
// @description  動畫瘋自動播放下一集
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @author       FlandreDaisuki
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/store.js/1.3.20/store.min.js
// @grant        none
// ==/UserScript==

// 已知限制：
// 火狐 + TamperMonkey：在容器分頁跟隱私分頁下會失敗，因為 TamperMonkey 似乎在這兩種分頁下有點問題
// 只能等到結束才跳下一集，不能放 ED 就跳 (畢竟不是 Netflix)

// Number, 0 stands for null
const { videoSn, nextSn, preSn } = animefun;

const videoReadyInterval = setInterval(() => {
  const video = document.querySelector('video');
  if(video) {
    clearInterval(videoReadyInterval);
    main(video);
  }
}, 250);

function main(video) {
  const state = {
    isAd: false,
  };

  if(store.get('autonext') === preSn) {
    // use this script to navigate to this page
    const agreeBtn = document.querySelector('#adult');
    if(agreeBtn) {
      agreeBtn.click();
    }
  }

  video.addEventListener('playing', (event) => {
    state.isAd = video.player.adIsPlaying;
    console.log('playing', 'state', state);
  });

  video.addEventListener('ended', (event) => {
    console.log('ended', 'state', state);
    if(!state.isAd && nextSn) {
      store.set('autonext', videoSn);
      location.assign(`?sn=${nextSn}`);
    }
  });
}
