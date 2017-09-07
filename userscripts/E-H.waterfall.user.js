// ==UserScript==
// @name        E-H.waterfall
// @description Infinite scroll @ e-h and exh
// @namespace   https://github.com/FlandreDaisuki
// @include     /^https?:\/\/(g.)?e[x-]hentai\.org(\/$|\/\?|\/tag\/)/
// @include     /^https?:\/\/(g.)?e[x-]hentai\.org\/(doujinshi|manga|artistcg|gamecg|western|non-h|imageset|cosplay|asianporn|misc)/
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @author      FlandreDaisuki
// @icon        http://i.imgur.com/dtRyvEX.png
// @version     2017.02.23
// @grant       none
// ==/UserScript==
/* jshint esnext: true */

const DISPLAY =
	$('#dmi a')
		.attr('href')
		.search(/dm_t/) < 0
		? 'Thumb'
		: 'List';
const BOOKSELECTOR =
	DISPLAY === 'List' ? 'table.itg tr:nth-child(n+2)' : 'div.id1';
const $container = DISPLAY === 'List' ? $('table.itg tbody') : $('div.itg');
const $bottomMsg = $(`<p id='BottomMsg'>Loading ...</p>`);

let bookGen = fetchSync(location.href);
let theLockLocked = false;
let theEnd = false;
let sizable = false;
let sz_lastX;
let sz_sizer;

function addStyle(styleStr) {
	$('head').append(`<style>${styleStr}</style>`);
}

function isTheOnlyPage() {
	return 0 === $('.ptt td:last-child a').length;
}

function fetchURL(url) {
	console.log(`fetchUrl = ${url}`);

	const with_cookie = {
		credentials: 'same-origin',
	};

	return fetch(url, with_cookie)
		.then(response => {
			return response.text();
		})
		.then(html => {
			return new DOMParser().parseFromString(html, 'text/html');
		})
		.then(doc => {
			let $doc = $(doc);
			let nextURL = $doc.find('.ptt td:last-child a').attr('href');
			let books = $doc.find(BOOKSELECTOR).toArray();

			if (DISPLAY === 'Thumb') {
				books = books
					.filter(elem => {
						return (
							-1 >=
							$(elem)
								.find('.id3 img')
								.attr('src')
								.search('blank.gif')
						);
					})
					.map(elem => {
						elem.style = '';
						return elem;
					});
			}
			return {
				nextURL,
				books,
			};
		});
}

function* fetchSync(urli) {
	let url = urli;
	do {
		yield new Promise((resolve, reject) => {
			if (theLockLocked) {
				reject();
			} else {
				theLockLocked = true;
				resolve();
			}
		})
			.then(() => {
				return fetchURL(url).then(info => {
					url = info.nextURL;
					return info.books;
				});
			})
			.then(books => {
				theLockLocked = false;
				return books;
			})
			.catch(err => {
				// Locked!
			});
	} while (url);
}

function appendNextPage() {
	let nextpage = bookGen.next();
	if (!nextpage.done) {
		nextpage.value.then(books => {
			$container.append(books);
		});
	}
	return nextpage.done;
}

function isBottomEnough(elem, limit) {
	return elem.getBoundingClientRect().top - $(window).height() < limit;
}

function ending() {
	if (theEnd) {
		console.log('End !!');
		$(document).off('wheel');
		$(document).off('scroll');
		$bottomMsg.text('End');
	}
}

function resize_itg(offset) {
	const w = $('div.itg').width();
	$('div.itg').width(w + offset * 2);
}

// Program Entry Point
if (!isTheOnlyPage()) {
	$bottomMsg.appendTo($('.ptb').parent());
	$('.ptb').remove();
	if (DISPLAY === 'List') {
		$('.itg tr').remove();
	} else {
		$('.itg div').remove();
		$('div.itg').prepend(
			'<div class="l_sizer"></div><div class="r_sizer"></div>',
		);
	}

	appendNextPage();

	$(document).on('wheel', event => {
		if (isBottomEnough($bottomMsg[0], 1000)) {
			theEnd = appendNextPage();
		}
		ending();
	});

	$(document).on('scroll', event => {
		if (isBottomEnough($bottomMsg[0], 500)) {
			theEnd = appendNextPage();
		}
		ending();
	});

	$('.l_sizer').on('mousedown', event => {
		sizable = true;
		sz_lastX = event.clientX;
		sz_sizer = -1;
	});

	$('.r_sizer').on('mousedown', event => {
		sizable = true;
		sz_lastX = event.clientX;
		sz_sizer = 1;
	});

	$(document)
		.on('mousemove', event => {
			if (!sizable) {
				return;
			} else {
				const offsetX = event.clientX - sz_lastX;
				resize_itg(offsetX * sz_sizer);
				sz_lastX = event.clientX;
			}
		})
		.on('mouseup', event => {
			sizable = false;
		});
} else {
	$(BOOKSELECTOR)
		.filter((i, elem) => {
			return (
				-1 <
				$(elem)
					.find('.id3 img')
					.attr('src')
					.search('blank.gif')
			);
		})
		.each((i, elem) => {
			elem.remove();
		});
}

addStyle(`
    #BottomMsg {
        clear: both;
        text-align: center;
        font-size: 48px;
    }
    div#toppane+div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    div#toppane+div div:first-child{
        align-self: flex-end;
    }
    div.ido.ido {
        max-width: none;
    }
    div.id1.id1 {
        max-height: 345px;
        min-height: 345px;
        float: none;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    div.id3 {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    div.id3 > a {
        display: block;
    }
    div.id2, div.it5 {
        height: initial;
    }
    div.id2, div.id4 {
        margin: 4px auto;
    }
    div.itg.itg {
        border-bottom: none;
        display: flex;
        flex-wrap: wrap;
        margin: 0px;
        padding: 0px;
        max-width: 100%;
        position: relative;
    }
    div#dmo#dmo {
        width: 200px;
        font-size: 12px;
    }
    div#dmi#dmi {
        top: 0px;
        left: 0px;
    }
    div.l_sizer {
        left: 0px;
    }
    div.r_sizer {
        right: 0px;
    }
    div.l_sizer,
    div.r_sizer {
        position: absolute;
        width: 6px;
        height: 100%;
        cursor: col-resize;
    }
    div.l_sizer:hover,
    div.r_sizer:hover {
        background-color: rgba(255,0,0,0.6)
    }
`);
