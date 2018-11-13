// ==UserScript==
// @name         DLSite Search Result Ranking Filter
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Add ranking filters of search results on DLSite
// @author       FlandreDaisuki
// @include      *://www.dlsite.com/*/fsr/*
// @exclude      *://www.dlsite.com/*/show_type/3/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @noframes
// ==/UserScript==

/* global jQuery */

(($) => {
  const time = {
    total: '累計ランキング',
    year: '年間ランキング',
    month: '月間ランキング',
    week: '週間ランキング',
    hour: '24時間ランキング',
  };

  const create$filter = (n) => {
    const id = `crown-${n}-filter`;

    const $icon = $('<img>')
      .attr('src', `//www.dlsite.com/images/web/home/icon_crown_${n}.png`)
      .attr('alt', time[n])
      .attr('title', time[n]);

    const $radio = $('<input>')
      .attr('type', 'checkbox')
      .attr('id', id)
      .attr('name', n)
      .addClass('crown-filter');

    return $('<label>')
      .attr('for', id)
      .append($radio, $icon);
  };

  const $filters = Object.keys(time).map(create$filter);

  const $form = $('<form>')
    .append($filters)
    .on('click', () => {
      const needs = $('.crown-filter')
        .toArray()
        .filter(el => el.checked)
        .map(el => el.name);

      $('#search_result_list > table > tbody > tr').toArray().forEach((tr) => {
        const $sr = $(tr);
        const $crowns = $sr.find('.work_rankin td');
        const hadCrowns = [];

        for (const crown of $crowns) {
          for (const n of Object.keys(time)) {
            if (crown.classList.contains(`crown_${n}`)) {
              hadCrowns.push(n);
            }
          }
        }

        let toHide = false;
        for (const need of needs) {
          if (!hadCrowns.includes(need)) {
            toHide = true;
            break;
          }
        }

        if (toHide) {
          $sr.addClass('crown-filter-hide');
        } else {
          $sr.removeClass('crown-filter-hide');
        }
      });
    });

  $('<div>')
    .attr('id', 'crown-filter-form')
    .appendTo('.status_select_box')
    .append('ランキングフィルター：', $form);

  $('<style>')
    .text(`
#crown-filter-form {
  display: flex;
  align-items: center;
  height: 36px;
  padding-right: 20px;
  float: right;
}
.crown-filter-hide {
  display: none;
}
    `)
    .appendTo('head');
})(jQuery);
