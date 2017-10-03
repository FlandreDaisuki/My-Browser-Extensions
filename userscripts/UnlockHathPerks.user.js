// ==UserScript==
// @name         Unlock Hath Perks
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Unlock Hath Perks and other helpers
// @author       FlandreDaisuki
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/************************************/
/*****     Before DOM Ready     *****/
/************************************/

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return Array.from(document.querySelectorAll(selector));
}

function $el(name, attr = {}, cb = () => {}) {
	const el = document.createElement(name);
	Object.assign(el, attr);
	cb(el);
	return el;
}

const uhpConfig = {
	abg: true,
	it: true,
	pe: true,
	fw: false,
};

function uhpSetConfig() {
	localStorage.setItem('uhp', JSON.stringify(uhpConfig));
}

function uhpGetConfig() {
	return JSON.parse(localStorage.getItem('uhp') || '{}');
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
	if (document.readyState == 'interactive') {
		main();
	}
};

/*****************************/
/*****     DOM Ready     *****/
/*****************************/
function main() {
	if (!location.pathname.startsWith('/s/')) {
		/* Make nav button */
		const nb = $('#nb');
		const mr = new Image();
		mr.src =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAHCAYAAADAp4fuAAAASUlEQVQImWXNMQ7AIAxDUa4WBuLTEilUmbnZ79YW1eOTZTdJVBXtG0mMMYg5OdDdMTMykwclYWb03lnr4sBfc0a8m+7O3vt4vwHmyjLMROhYUAAAAABJRU5ErkJggg==';
		const uhpBtnEl = $el('a', { textContent: 'Unlock Hath Perks', id: 'uhp-btn' }, el => {
			el.addEventListener('click', () => {
				$('#uhp-panel-container').classList.remove('hidden');
			});
		});
		nb.appendChild(mr);
		nb.appendChild(document.createTextNode(' '));
		nb.appendChild(uhpBtnEl);

		/* Setup UHP Panel */
		const uhpPanelContainerEl = $el('div', { className: 'hidden', id: 'uhp-panel-container' }, el => {
			el.addEventListener('click', () => {
				el.classList.add('hidden');
			});
		});
		document.body.appendChild(uhpPanelContainerEl);

		const uhpPanelEl = $el('div', { id: 'uhp-panel' }, el => {
			el.addEventListener('click', event => {
				event.stopPropagation();
			});
		});
		uhpPanelContainerEl.appendChild(uhpPanelEl);

		/* Setup UHP Configs */
		uhpPanelEl.appendChild($el('h1', { textContent: 'Hath Perks' }));

		const uhpABGLabel = $el('label', { textContent: 'Ads-Be-Gone', htmlFor: 'uhp-conf-abg' });
		const uhpABGInput = $el('input', { type: 'checkbox', id: 'uhp-conf-abg', checked: uhpConfig.abg }, el => {
			el.addEventListener('change', () => {
				uhpConfig.abg = el.checked;
				uhpSetConfig();
			});
		});
		const uhpABGRow = $el('div', { className: 'uhp-row' }, el => {
			el.appendChild(uhpABGLabel);
			el.appendChild(uhpABGInput);
		});
		uhpPanelEl.appendChild(uhpABGRow);

		const uhpITLabel = $el('label', { textContent: 'Infinity Thumbs', htmlFor: 'uhp-conf-it' });
		const uhpITInput = $el('input', { type: 'checkbox', id: 'uhp-conf-it', checked: uhpConfig.it }, el => {
			el.addEventListener('change', () => {
				uhpConfig.it = el.checked;
				uhpSetConfig();
			});
		});
		const uhpITRow = $el('div', { className: 'uhp-row' }, el => {
			el.appendChild(uhpITLabel);
			el.appendChild(uhpITInput);
		});
		uhpPanelEl.appendChild(uhpITRow);

		const uhpPELabel = $el('label', { textContent: 'Paging Enlargement', htmlFor: 'uhp-conf-pe' });
		const uhpPEInput = $el('input', { type: 'checkbox', id: 'uhp-conf-pe', checked: uhpConfig.pe }, el => {
			el.addEventListener('change', () => {
				uhpConfig.pe = el.checked;
				uhpSetConfig();
			});
		});
		const uhpPERow = $el('div', { className: 'uhp-row' }, el => {
			el.appendChild(uhpPELabel);
			el.appendChild(uhpPEInput);
		});
		uhpPanelEl.appendChild(uhpPERow);

		/* Setup Special UHP Configs */
		uhpPanelEl.appendChild($el('h1', { textContent: 'Others' }));

		const uhpFWLabel = $el('label', { textContent: 'Full Width', htmlFor: 'uhp-conf-fw' });
		const uhpFWInput = $el('input', { type: 'checkbox', id: 'uhp-conf-fw', checked: uhpConfig.fw }, el => {
			el.addEventListener('change', () => {
				uhpConfig.fw = el.checked;
				uhpSetConfig();
				if (uhpConfig.fw) {
					$('#uhp-full-width-container').classList.add('fullwidth');
				} else {
					$('#uhp-full-width-container').classList.remove('fullwidth');
				}
			});
		});
		const uhpFWRow = $el('div', { className: 'uhp-row' }, el => {
			el.appendChild(uhpFWLabel);
			el.appendChild(uhpFWInput);
		});
		uhpPanelEl.appendChild(uhpFWRow);
	}

	/* Setup UHP Style */
	const uhpCSS = `
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
	margin: 4px;
	padding: 4px;
}
#uhp-full-width-container div.id2 {
	overflow: visible;
	height: initial;
	padding: 4px;
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
}
.uhp-row>label[for="uhp-conf-it"]:hover::before {
	content: "This option will disable popular section.";
    padding: 6px;
    border: 1px solid black;
    border-radius: 10px 10px 0;
    position: absolute;
    background-color: black;
    transform: translate(-101%, -70%);
    transform-origin: bottom right;
    color: white;
}
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
}`;

	document.head.appendChild(
		$el('style', {
			textContent: uhpCSS,
		}),
	);

	if ($('#searchbox')) {
		const ido = $('div.ido');
		ido.id = 'uhp-full-width-container';
		if (uhpConfig.fw) {
			ido.classList.add('fullwidth');
		}
	}

	/* Main Functions by Configs */
	if (uhpConfig.abg) {
		if ($('#searchbox')) {
			const mode = $('#dmi>span').textContent === 'Thumbnails' ? 't' : 'l';
			const parent = mode === 't' ? $('div.itg') : $('table.itg tbody');
			if (mode === 'l') {
				$$('table.itg tr:nth-of-type(n+2)').forEach(el => {
					if (!el.className) {
						el.remove();
					}
				});
			}
		}

		$$('script[async]').forEach(el => el.remove());
		$$('iframe').forEach(el => el.remove());
	}

	async function getNextPage(nextURL, mode) {
		const selector = mode === 't' ? 'div.id1' : 'table.itg tr:nth-of-type(n+2)';
		const result = {
			elements: [],
			nextURL: null,
		};
		if (!nextURL) {
			return result;
		}
		const response = await fetch(nextURL, { credentials: 'same-origin' });
		if (response.ok) {
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			result.elements = Array.from(doc.querySelectorAll(selector));
			if (uhpConfig.abg) {
				result.elements = result.elements.filter(el => el.className);
			}
			result.elements = result.elements.map(el => {
				el.style = '';
				return el;
			});
			const nextEl = doc.querySelector('.ptb td:last-child > a');
			result.nextURL = nextEl ? nextEl.href : null;
		}
		return result;
	}

	if (uhpConfig.it && $('#searchbox')) {
		const nextEl = $('.ptb td:last-child > a');
		let nextURL = nextEl ? nextEl.href : null;
		const mode = $('#dmi>span').textContent === 'Thumbnails' ? 't' : 'l';
		const parent = mode === 't' ? $('div.itg') : $('table.itg tbody');
		const status = $el('h1', { textContent: 'Loading...', id: 'uhp-status' });
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
			$$('div.c, #pt, #pp').forEach(el => el.remove());
			$$('div.id1').forEach(el => {
				el.style = '';
			});
		}

		const observer = new IntersectionObserver(
			async (entrys, self) => {
				if (entrys[0].isIntersecting) {
					if (urlSet.has(nextURL)) {
						return;
					} else {
						urlSet.add(nextURL);
					}
					const nextPage = await getNextPage(nextURL, mode);
					console.log(nextPage);
					nextPage.elements.forEach(el => parent.appendChild(el));
					nextURL = nextPage.nextURL;
					if (!nextURL) {
						self.disconnect();
						status.textContent = 'End';
					}
				}
			},
			{ rootMargin: '0px 0px 300px 0px' },
		);
		observer.observe(status);
	}

	async function getNextGallaryPage(nextURL) {
		const result = {
			elements: [],
			nextURL: null,
		};
		if (!nextURL) {
			return result;
		}
		const response = await fetch(nextURL, { credentials: 'same-origin' });
		if (response.ok) {
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			result.elements = Array.from(doc.querySelectorAll('#gdt > div'));
			const nextEl = doc.querySelector('.ptb td:last-child > a');
			result.nextURL = nextEl ? nextEl.href : null;
		}
		return result;
	}

	if (uhpConfig.pe && location.pathname.startsWith('/g/')) {
		const urlSet = new Set();
		$('#gdo1').style.display = 'none';
		const nextEl = $('.ptb td:last-child > a');
		let nextURL = nextEl ? nextEl.href : null;
		const parent = $('#gdt');
		const observer = new IntersectionObserver(
			async (entrys, self) => {
				if (urlSet.has(nextURL)) {
					return;
				} else {
					urlSet.add(nextURL);
				}
				console.log(urlSet, nextURL);
				const nextPage = await getNextGallaryPage(nextURL);
				console.log(nextPage);
				nextPage.elements.forEach(el => parent.appendChild(el));
				nextURL = nextPage.nextURL;
				if (!nextURL) {
					self.disconnect();
				}
			},
			{ rootMargin: '0px 0px 100px 0px' },
		);
		observer.observe($('#cdiv'));
	}
}
