// ==UserScript==
// @name        CustomDMHY
// @description Custom your favorite teams for new anime
// @namespace   FlandreDaisuki
// @include     https://share.dmhy.org/*
// @author      FlandreDaisuki
// @version     2018.08.01
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant       none
// ==/UserScript==
/* globals $ */
/* eslint-disable no-alert */

(($) => {
  // 刪廣告
  $('[id*=ad]').remove();

  // reset
  $('#mini_jmd')
    .attr('id', 'custom-dmhy-origin-tab')
    .addClass('custom-dmhy-tab')
    .removeClass('fl');

  class Storage {
    constructor() {
      if (!localStorage.CustomDMHY) {
        this.data = [];
      } else {
        this.data = JSON.parse(localStorage.CustomDMHY);
      }
    }
    push(name, keyword) {
      this.data.push([name, keyword]);
      this.save();
    }
    delete(name) {
      const idx = this.data.findIndex(sub => sub[0] === name);
      if (idx > -1) {
        this.data.splice(idx, 1);
      }
      this.save();
    }
    clean() {
      this.data = [];
      this.save();
    }
    save() {
      localStorage.CustomDMHY = JSON.stringify(this.data);
    }
  }

  const store = new Storage();

  let tabState = 'o';
  if (localStorage.CustomDMHYTab) {
    tabState = localStorage.CustomDMHYTab;
  }

  const $mainContainer = $('#custom-dmhy-origin-tab').parent();
  $mainContainer.attr('id', 'custom-dmhy-main-container');
  const $customTab = $('<div id="custom-dmhy-custom-tab" class="custom-dmhy-tab"></div>');
  const $originTabCheckbox = $(`<input id="custom-dmhy-origin-tab-checkbox" name="custom-dmhy-tab" type="radio" ${(tabState === 'o') ? 'checked' : ''}/>`);
  const $originTabCheckboxLabel = $('<label for="custom-dmhy-origin-tab-checkbox">原始番劇頁</label>').on('click', () => { localStorage.CustomDMHYTab = 'o'; });
  const $customTabCheckbox = $(`<input id="custom-dmhy-custom-tab-checkbox" name="custom-dmhy-tab" type="radio" ${(tabState === 'c') ? 'checked' : ''}/>`);
  const $customTabCheckboxLabel = $('<label for="custom-dmhy-custom-tab-checkbox">自訂番劇頁</label>').on('click', () => { localStorage.CustomDMHYTab = 'c'; });

  const $subList = $('<ul id="custom-dmhy-sub-list"></ul>');
  const $inputs = $('<div id="custom-dmhy-inputs"></div>');

  const $inputCustomName = $('<input id="custom-dmhy-input-custom-name" placeholder="取個名字，例：\'[魯邦聯會] 魯邦三世第五季\'" style="width: 300px;"/>');
  const $inputKeyword = $('<input id="custom-dmhy-input-keyword" placeholder="真正的關鍵字，例：\'魯邦聯會 魯邦三世 big5 720p\'" style="width: 350px;"/>');

  const createSubEl = (name, keyword) => {
    const $li = $('<li class="custom-dmhy-sub"></li>');
    const $link = $(`<a href="/topics/list?keyword=${encodeURIComponent(keyword)}">${name}</a>`);
    const $edit = $('<a role="button" href="javascript:;">修改</a>').on('click', () => {
      store.delete(name);
      $inputCustomName.val(name);
      $inputKeyword.val(keyword);
      $li.remove();
    });
    const $delete = $('<a role="button" href="javascript:;">刪除</a>').on('click', () => {
      store.delete(name);
      $li.remove();
    });
    return $li.append($link, $edit, $delete);
  };

  const $inputAdd = $('<input id="custom-dmhy-input-add" type="button" value="新增"/>').on('click', () => {
    if (!$inputCustomName.val()) {
      alert('名字不可為空');
    } else if (!$inputKeyword.val()) {
      alert('關鍵字不可為空');
    } else {
      $subList.append(createSubEl($inputCustomName.val(), $inputKeyword.val()));
      store.push($inputCustomName.val(), $inputKeyword.val());
      $inputCustomName.val('');
      $inputKeyword.val('');
    }
  });

  const $inputClearAll = $('<input id="custom-dmhy-input-clear-all" type="button" value="清除全部"/>').on('click', () => {
    $subList.empty();
    store.clean();
  });


  $subList.append(store.data.map(([name, keyword]) => createSubEl(name, keyword)));

  $inputs.append($inputCustomName, $inputKeyword, $inputAdd, $inputClearAll);

  $customTab.append($subList, $inputs);

  $mainContainer
    .prepend(
      $originTabCheckbox,
      $originTabCheckboxLabel,
      $customTabCheckbox,
      $customTabCheckboxLabel,
    )
    .append($customTab);

  $('head').append(`
  <style>
  #custom-dmhy-main-container {
    display: flex;
    flex-flow: row wrap;
  }
  input[name="custom-dmhy-tab"] {
    display: none;
  }
  input[name="custom-dmhy-tab"] + label {
    display: inline-block;
    padding: 3px 15px;
    background: #FFF;
    cursor: pointer;
    border-top: 1px solid #247;
    border-left: 1px solid #247;
    border-right: 1px solid #247;
    border-radius: 5px 5px 0 0;
    font-size: 14px;
  }
  input[name="custom-dmhy-tab"]:checked + label {
    border-top: 3px solid dodgerblue;
  }
  #custom-dmhy-origin-tab-checkbox:checked ~ #custom-dmhy-custom-tab,
  #custom-dmhy-custom-tab-checkbox:checked ~ #custom-dmhy-origin-tab {
    display: none;
  }
  #custom-dmhy-custom-tab {
    font-size: 14px;
  }
  .custom-dmhy-tab {
    width: 100%;
    border: 1px solid #247;
    background: #FFF;
    margin-bottom: 10px;
    padding: 2px;
  }
  #custom-dmhy-sub-list {
    display: flex;
    flex-flow: row wrap;
    list-style: none;
    padding: 0 20px;
  }
  .custom-dmhy-sub {
    margin: 5px;
    padding: 5px;
    border: 1px solid dodgerblue;
    border-radius: 5px;
    white-space: nowrap;
  }
  .custom-dmhy-sub > a {
    padding: 2px 4px;
  }
  .custom-dmhy-sub > a[role="button"]::before {
    content: '';
    border-left: 1px dotted;
    margin-right: 8px;
  }
  #custom-dmhy-inputs {
    display: flex;
    justify-content: center;
    border-top: 3px dotted cadetblue;
    padding: 10px 0;
  }
  #custom-dmhy-inputs > * {
    margin: 0 10px;
    border-radius: 5px;
    border: 1px solid gray;
    padding: 3px 10px;
  }
  #custom-dmhy-inputs > [type="button"] {
    border: none;
    font-size: 14px;
  }
  #custom-dmhy-inputs > [type="button"]:hover {
    box-shadow: 1px 1px 1px darkgray;
    cursor: pointer;
    transform: translate(-1px, -1px);
  }
  #custom-dmhy-input-add {
    background-color: lightgreen;
  }
  #custom-dmhy-input-clear-all {
    background-color: crimson;
    color: white;
  }
  </style>
  `.trim());
})($.noConflict(true));
