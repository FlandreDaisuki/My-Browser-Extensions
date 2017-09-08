// ==UserScript==
// @name        PixivAuto10
// @description Rating 10 stars / smile automatically
// @namespace   https://github.com/FlandreDaisuki
// @include     *://www.pixiv.net/member_illust.php?*
// @version     2.1.3
// @icon        http://i.imgur.com/cRWoMhw.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.3/axios.min.js
// @grant       none
// @compatible  firefox
// @compatible  chrome
// @noframes
// ==/UserScript==

// Chrome compatible
if (!document.getElementsByClassName('rated').length) {
	const tt = document.querySelector('input[name="tt"]').value;
	const i_id = pixiv.context.illustId;
	const u_id = pixiv.context.userId;
	axios({
		method: 'POST',
		url: '/rpc_rating.php',
		data: `mode=save&i_id=${i_id}&u_id=${u_id}&qr=0&score=10&tt=${tt}`,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
		},
	}).then(() => {
		$('.js-nice-button')
			.addClass('rated')
			.off()
			.find('.smile')
			.addClass('active');
	});
}
