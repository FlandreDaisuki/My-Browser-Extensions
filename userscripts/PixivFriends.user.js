// ==UserScript==
// @name        PixivFriends
// @description sugo~i
// @namespace   https://github.com/FlandreDaisuki
// @include     *://www.pixiv.net/member_illust.php?*
// @version     1.0.4
// @icon        http://i.imgur.com/I7mA6GI.png
// @grant       none
// @compatible  firefox
// @compatible  chrome
// @noframes
// ==/UserScript==

const L10NLike = {
	en: 'Like',
	ja: 'いいね',
	ko: '좋아요',
	zh: '赞',
	'zh-tw': '讚',
};

const LIKE = L10NLike[document.documentElement.lang];

const likeSelectors = [
	'.score .description',
	'.score .result',
	'.score .view-count + dt',
];

$(likeSelectors.join(','))
	.toArray()
	.forEach(x => {
		x.innerText = x.innerText.replace(LIKE, 'すご一い');
	});

const style = document.createElement('style');
$(style)
	.text(
		`
.score ._nice-button {
	background-color: #BBB;
}
.score ._nice-button.rated {
	background-color: #FCDBA4;
}

.score ._nice-button .description {
	color: #FCE6D1;
}
.score ._nice-button.rated .description {
	color: #F39801;
}

.score ._nice-button .smile-icon {
	background-image: url("//i.imgur.com/hv80wid.png");
	height: 12px;
	background-position: top;
	vertical-align: baseline;
}
.score ._nice-button.rated .smile-icon {
	background-position: bottom;
}

.score ._nice-button .smile {
	background-image: url("//i.imgur.com/I7mA6GI.png");
}`,
	)
	.appendTo('head');
