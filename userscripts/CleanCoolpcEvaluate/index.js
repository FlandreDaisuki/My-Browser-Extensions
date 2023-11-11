import { $, $style } from '../helpers/common';
// 推薦搭配 AdGuard Annoyances 過濾清單

/* cSpell:ignore vwpro mesg Ttitle Fitem */
/* global winkblue */

// 取消鎖右鍵
document.body.removeAttribute('oncontextmenu');
document.body.removeAttribute('onselectstart');

// 總金額預覽移到上面
winkblue.on('#fDiv', (floatingBar) => {
  winkblue.off('#fDiv');
  floatingBar.remove();
  $('#know').insertAdjacentElement('afterend', floatingBar);
});

// 保留輸出圖片功能
winkblue.on('#vwpro', () => {
  $('#doc').classList.add('zTop');
});

winkblue.on('button[onclick="Gauze(2)"]', (imageExportCancelBtnEl) => {
  winkblue.off('button[onclick="Gauze(2)"]');
  imageExportCancelBtnEl.addEventListener('click', () => {
    $('#doc').classList.remove('zTop');
  });
});

// 刪除無用的 iframe
const iframeSelectors = [
  'iframe[src^="/home"]',
  'iframe[src$="eval-mesg.php"]',
];

winkblue.on(String(iframeSelectors), (iframe) => {
  iframe.remove();
});

// 調整樣式
$style(`
body {
  overflow: auto !important;
}
#Psu,
#hid,
#Ttitle > tbody > tr:nth-of-type(1) > td:nth-of-type(2),
#Ttitle > tbody > tr:nth-of-type(2) {
  display: none !important;
}
#doc {
  z-index: -1 !important;
}
form[action="eva-excel.php"] {
  position: relative;
}
#Ttitle > tbody > tr:first-of-type > td:first-of-type {
  display: grid;
  grid-template-columns: repeat(2, auto);
}
#fDiv {
  position: relative;
  display: flex;
  transform: initial;
  left: inherit !important
}
#ftb {
  margin: 0;
  border: 2px solid black;
}
#Fitem {
  position: relative !important;
}
#doc.zTop {
  z-index: 20 !important;
  background: rgba(0, 0, 0, 0.8);
}
#MatchArea {
  position: absolute;
  top: 100%;
}`);
