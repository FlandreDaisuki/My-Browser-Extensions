// ==UserScript==
// @name         Unlock Hath Perks
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1.3
// @description  Unlock Hath Perks and other helpers
// @author       FlandreDaisuki
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

'use strict';

/************************************/
/*****     Before DOM Ready     *****/
/************************************/

function $find(el, selector, cb = () => {}) {
	const found = el.querySelector(selector);
	cb(found);
	return found;
}

function $findAll(el, selector, cb = () => {}) {
	const found = Array.from(el.querySelectorAll(selector));
	cb(found);
	return found;
}

function $(selector) {
	return $find(document, selector);
}

function $$(selector) {
	return $findAll(document, selector);
}

function $el(name, attr = {}, cb = () => {}) {
	const el = document.createElement(name);
	Object.assign(el, attr);
	cb(el);
	return el;
}

function $style(textContent) {
	$el('style', {textContent}, el => document.head.appendChild(el));
}

// sessionStorage namespace:
// in tab && in domain
function $scrollYTo(n) {
	n = parseFloat(n | 0);
	const id = setInterval(() => {
		scrollTo(scrollX, n);
		if (scrollY >= n) {
			clearInterval(id);
		}
	}, 100);
}

class API {
	// ref: https://github.com/tommy351/ehreader-android/wiki/E-Hentai-JSON-API

	static gInfo(href) {
	// pathname = '/g/{gallery_id}/{gallery_token}/'
		const a = $el('a', {href});
		const path = a.pathname.split('/').filter(x => x);
		if (path[0] !== 'g') {
			return null;
		}
		// [{gallery_id}, {gallery_token}]
		return path.slice(1);
	}

	static async gdata(gInfos) {
		const r = await fetch('/api.php', {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({
				method: 'gdata',
				gidlist: gInfos,
			}),
		});
		const json = await r.json();
		if (json.error) {
			console.error('API.gdata(): gInfos', gInfos);
			throw new Error(json.error);
		} else {
			return json.gmetadata;
		}
	}

	static async sPage(href) {
		const r = await fetch(href, {credentials: 'same-origin'});
		const html = await r.text();
		const imgsrc = html.replace(/[\s\S]*id="img" src="([^"]+)"[\s\S]*/g, '$1');
		return {
			imgsrc,
		};
	}
}

const uhpConfig = {
	abg: true,
	it: true,
	pe: true,
	fw: false,
};

function uhpSetConfig() {
	GM_setValue('uhp', uhpConfig);
}

function uhpGetConfig() {
	return GM_getValue('uhp', {});
}

Object.assign(uhpConfig, uhpGetConfig());
uhpSetConfig();

if (uhpConfig.abg) {
	Object.defineProperty(window, 'adsbyjuicy', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: null,
	});
}

document.onreadystatechange = function() {
	if (document.readyState === 'interactive') {
		main();
		$style(cssText);
	}
};

/*****************************/
/*****     DOM Ready     *****/
/*****************************/

function main() {
	if (!location.pathname.startsWith('/s/')) {
	/* Make nav button */
		const nb = $('#nb');
		const mr = $el('img', {src: '//ehgt.org/g/mr.gif'});
		const uhpBtnEl =
		$el('a', {
			textContent: 'Unlock Hath Perks',
			id: 'uhp-btn',
		}, el => {
			el.addEventListener('click', () => {
				$('#uhp-panel-container').classList.remove('hidden');
			});
		});
		nb.appendChild(mr);
		nb.appendChild(document.createTextNode(' '));
		nb.appendChild(uhpBtnEl);

		/* Setup UHP Panel */
		const uhpPanelContainerEl = $el('div', {
			className: 'hidden',
			id: 'uhp-panel-container',
		}, el => {
			el.addEventListener('click', () => { el.classList.add('hidden'); });
		});
		document.body.appendChild(uhpPanelContainerEl);

		const uhpPanelEl = $el('div', {
			id: 'uhp-panel',
		}, el => {
			el.addEventListener('click', event => { event.stopPropagation(); });
		});
		uhpPanelContainerEl.appendChild(uhpPanelEl);

		/* Setup UHP Configs */
		uhpPanelEl.appendChild($el('h1', {
			textContent: 'Hath Perks',
		}));

		$el('div', {
			className: 'uhp-row',
		}, row => {
			const uhpLabel = $el('label', {
				textContent: 'Ads-Be-Gone',
				htmlFor: 'uhp-conf-abg',
			});
			const uhpInput = $el('input', {
				type: 'checkbox',
				id: 'uhp-conf-abg',
				checked: uhpConfig.abg,
			}, el => {
				el.addEventListener('change', () => {
					uhpConfig.abg = el.checked;
					uhpSetConfig();
				});
			});
			row.appendChild(uhpLabel);
			row.appendChild(uhpInput);
			uhpPanelEl.appendChild(row);
		});

		$el('div', {
			className: 'uhp-row',
		}, row => {
			const uhpLabel = $el('label', {
				textContent: 'Infinity Thumbs',
				htmlFor: 'uhp-conf-it',
			});
			const uhpInput = $el('input', {
				type: 'checkbox',
				id: 'uhp-conf-it',
				checked: uhpConfig.it,
			}, el => {
				el.addEventListener('change', () => {
					uhpConfig.it = el.checked;
					uhpSetConfig();
				});
			});
			row.appendChild(uhpLabel);
			row.appendChild(uhpInput);
			uhpPanelEl.appendChild(row);
		});

		$el('div', {
			className: 'uhp-row',
		}, row => {
			const uhpLabel = $el('label', {
				textContent: 'Paging Enlargement',
				htmlFor: 'uhp-conf-pe',
			});
			const uhpInput = $el('input', {
				type: 'checkbox',
				id: 'uhp-conf-pe',
				checked: uhpConfig.pe,
			}, el => {
				el.addEventListener('change', () => {
					uhpConfig.pe = el.checked;
					uhpSetConfig();
				});
			});
			row.appendChild(uhpLabel);
			row.appendChild(uhpInput);
			uhpPanelEl.appendChild(row);
		});

		/* Setup Special UHP Configs */
		uhpPanelEl.appendChild($el('h1', {
			textContent: 'Others',
		}));

		$el('div', {
			className: 'uhp-row',
		}, row => {
			const uhpLabel = $el('label', {
				textContent: 'Full Width',
				htmlFor: 'uhp-conf-fw',
			});
			const uhpInput = $el('input', {
				type: 'checkbox',
				id: 'uhp-conf-fw',
				checked: uhpConfig.fw,
			}, el => {
				el.addEventListener('change', () => {
					uhpConfig.fw = el.checked;
					uhpSetConfig();
					const fn = uhpConfig.fw ? 'add' : 'remove';
					$('#uhp-full-width-container').classList[fn]('fullwidth');
				});
			});
			row.appendChild(uhpLabel);
			row.appendChild(uhpInput);
			uhpPanelEl.appendChild(row);
		});
	}

	if ($('#searchbox')) {
		const ido = $('div.ido');
		ido.id = 'uhp-full-width-container';
		if (uhpConfig.fw) {
			ido.classList.add('fullwidth');
		}
	}

	/* Main Functions by Configs */

	/**************/
	/* Ad-Be-Gone */
	/**************/
	if (uhpConfig.abg) {
		if ($('#searchbox')) {
			const mode = $('#dmi>span').textContent === 'Thumbnails' ? 't' : 'l';
			if (mode === 'l') {
				$$('table.itg tr:nth-of-type(n+2)')
					.forEach(el => {
						if (!el.className) {
							el.remove();
						}
					});
			}
		}

		$$('script[async]').forEach(el => el.remove());
		$$('iframe').forEach(el => el.remove());
	}

	/*******************/
	/* Infinity Thumbs */
	/*******************/
	async function getNextPage(nextURL, mode) {
		const selector = mode === 't' ? 'div.id1' : 'table.itg tr:nth-of-type(n+2)';

		const result = {
			elements: [],
			nextURL: null,
		};
		if (!nextURL) {
			return result;
		}
		const response = await fetch(nextURL, {
			credentials: 'same-origin',
		});
		if (response.ok) {
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			result.elements = Array.from($findAll(doc, selector));
			if (uhpConfig.abg) {
				result.elements = result.elements.filter(el => el.className);
			}
			result.elements =
		result.elements
			.filter(el => {
				if (mode === 't') {
					return !$find(el, '.id3 img').src.endsWith('blank.gif');
				}
				return true;
			})
			.map(el => {
				el.removeAttribute('style');
				return el;
			});

			const nextEl = $find(doc, '.ptb td:last-child > a');
			result.nextURL = nextEl ? nextEl.href : null;
		}
		return result;
	}

	if (uhpConfig.it && $('#searchbox')) {
		(async() => {
			const nextEl = $('.ptb td:last-child > a');
			let nextURL = nextEl ? nextEl.href : null;
			const mode = $('#dmi>span').textContent === 'Thumbnails' ? 't' : 'l';
			const parent = mode === 't' ? $('div.itg') : $('table.itg tbody');
			const status = $el('h1', {
				textContent: 'Loading...',
				id: 'uhp-status',
			});
			$('table.ptb').replaceWith(status);
			const urlSet = new Set();

			if (mode === 'l') {
				if (location.hostname.startsWith('exh')) {
					parent.classList.add('uhp-list-parent-exh');
				} else {
					parent.classList.add('uhp-list-parent-eh');
				}
			} else {
				parent.style.borderBottom = 'none';
				$$('div.id1').forEach(el => el.removeAttribute('style'));
			}

			// remove popular section
			$$('div.c, #pt, #pp').forEach(el => el.remove());

			// this page
			const thisPage = await getNextPage(location.href, mode);
			while (parent.firstChild) {
				parent.firstChild.remove();
			}
			thisPage.elements.forEach(el => parent.appendChild(el));

			// next page
			document.addEventListener('scroll', async() => {
				const anchorTop = status.getBoundingClientRect().top;
				const windowHeight = window.innerHeight;

				if (anchorTop < windowHeight * 2 && !urlSet.has(nextURL)) {
					urlSet.add(nextURL);
					const nextPage = await getNextPage(nextURL, mode);
					console.log(nextPage);
					nextPage.elements.forEach(el => parent.appendChild(el));
					nextURL = nextPage.nextURL;
					if (!nextURL) {
						status.textContent = 'End';
					}
				}
			});

			// emit once
			// $scrollYTo(1);
			// $scrollYTo(0);
		})();
	}

	/**********************/
	/* Paging Enlargement */
	/**********************/
	async function getNextGallaryPage(nextURL) {
		const result = {
			elements: [],
			nextURL: null,
		};
		if (!nextURL) {
			return result;
		}
		const response = await fetch(nextURL, {
			credentials: 'same-origin',
		});
		if (response.ok) {
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			result.elements = $findAll(doc, '#gdt > div');
			const nextEl = $findAll(doc, '.ptb td:last-child > a');
			result.nextURL = nextEl ? nextEl.href : null;
		}
		return result;
	}

	if (uhpConfig.pe && location.pathname.startsWith('/g/')) {
		(async() => {
			$('#gdo1').style.display = 'none';
			const nextEl = $('.ptb td:last-child > a');
			let nextURL = nextEl ? nextEl.href : null;
			const parent = $('#gdt');
			parent.classList.add('uhp-page-parent');
			const urlSet = new Set();

			// this page
			const thisPage = await getNextGallaryPage(location.href);
			while (parent.firstChild) {
				parent.firstChild.remove();
			}
			thisPage.elements.forEach(el => parent.appendChild(el));

			// next page
			document.addEventListener('scroll', async() => {
				const anchorTop = $('#cdiv').getBoundingClientRect().top;
				const windowHeight = window.innerHeight;

				if (anchorTop < windowHeight * 2 && !urlSet.has(nextURL)) {
					urlSet.add(nextURL);
					const nextPage = await getNextGallaryPage(nextURL);
					console.log(nextPage);
					nextPage.elements.forEach(el => parent.appendChild(el));
					nextURL = nextPage.nextURL;
				}
			});

			// emit once
			// $scrollYTo(1);
			// $scrollYTo(0);
		})();
	}

	/**********************/
	/* Scroll Restoration */
	/**********************/
	history.scrollRestoration = 'manual';

	window.addEventListener('beforeunload', () => {
		history.replaceState(scrollY, null);
	});

	window.addEventListener('load', () => {
		if (history.state) {
			$scrollYTo(history.state);
		}
	});
}

var cssText = `
#uhp-btn {
	cursor: pointer;
}
#uhp-panel-container {
	position:fixed;
	top: 0;
	height: 100vh;
	width: 100vw;
	background-color: rgba(200, 200, 200, 0.7);
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
}
#uhp-panel-container.hidden {
	visibility: hidden;
	opacity: 0;
}
#uhp-panel {
	padding: 1.2rem;
	border-radius: 1rem;
	background-color: floralwhite;
	font-size: 1rem;
	color: darkred;
}
#uhp-full-width-container.fullwidth,
#uhp-full-width-container.fullwidth div.itg {
	max-width: none;
}
#uhp-full-width-container div.itg {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}
#uhp-full-width-container div.id1 {
	height: 345px;
	float: none;
	display: flex;
	flex-direction: column;
	margin: 3px 0;
	padding: 4px 0;
}
#uhp-full-width-container div.id2 {
	overflow: visible;
	height: initial;
	margin: 4px auto;
}
#uhp-full-width-container div.id3 {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}
.uhp-row {
	margin: 0.8rem;
}
.uhp-row>input,
.uhp-row>label {
	cursor: pointer;
	position: relative;
}
.uhp-row>label[for="uhp-conf-it"]:hover::before {
	content: "This option will disable popular section.";
	padding: 6px;
	border-radius: 8px;
	position: absolute;
	background-color: black;
	color: white;
	right: 110%;
	top: -30%;
	width: 350px;
}
.uhp-row>label[for="uhp-conf-fw"]:hover::before {
	content: "This option affects on only thumbnails mode.";
	padding: 6px;
	border-radius: 8px;
	position: absolute;
	background-color: black;
	color: white;
	right: 110%;
	top: -30%;
	width: 350px;
}
.uhp-list-parent-eh tr:nth-of-type(2n+1){
	background-color: #EDEBDF;
}
.uhp-list-parent-eh tr:nth-of-type(2n+2){
	background-color: #F2F0E4;
}
.uhp-list-parent-exh tr:nth-of-type(2n+1) {
	background-color: #363940;
}
.uhp-list-parent-exh tr:nth-of-type(2n+2){
	background-color: #4F535B;
}
#uhp-status {
	text-align: center;
	font-size: 3rem;
	clear: both;
	padding: 2rem 0;
}
/* replace */
div#gdt.uhp-page-parent {
	display: flex;
	flex-wrap: wrap;
}
div#gdt.uhp-page-parent>div{
	float: initial;
}`;
