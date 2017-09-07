// ==UserScript==
// @name                Ani Gamer Friends
// @name:zh-TW          動畫瘋フレンズ
// @description         すごーい！
// @description:zh-TW   すごーい！
// @namespace           https://github.com/FlandreDaisuki
// @include             https://ani.gamer.com.tw/
// @include             https://ani.gamer.com.tw/index.php
// @include             https://ani.gamer.com.tw/animeList.php*
// @include             https://ani.gamer.com.tw/mygather.php*
// @version             0.2
// @icon                http://i.imgur.com/I7mA6GI.png
// @grant               none
// @compatible          firefox
// @compatible          chrome
// @noframes
// ==/UserScript==
const $$ = s => Array.from(document.querySelectorAll(s));

const hearts = $$(
	'section.index_new button.newanime__order > i, section.old_list div.order > i',
);
$(`<div class="japari-like"></div>`).replaceAll(hearts);

const style = document.createElement('style');
$(style)
	.text(
		`
div.japari-like {
	background-image: url("//i.imgur.com/DPOmcxf.png");
	background-size: 32px;
	height: 32px;
	background-repeat: no-repeat;
	width: 32px;
	right: 4px;
	top: 4px;
	position: absolute;
}
section.index_new button.newanime__order.is-order,
section.old_list div.order.yes,
section.index_new button.newanime__order:hover,
section.old_list div.order:hover {
	background-color: #FCDBA4;
}
section.index_new button.newanime__order:hover div.japari-like,
section.old_list div.order:hover div.japari-like,
section.index_new button.newanime__order.is-order div.japari-like,
section.old_list div.order.yes div.japari-like {
	background-position-y: -32px;
}`,
	)
	.appendTo('head');
