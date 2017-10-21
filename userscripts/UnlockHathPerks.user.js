// ==UserScript==
// @name           Unlock Hath Perks
// @name:zh        解鎖 Hath Perks
// @description    Unlock Hath Perks and add other helpers
// @description:zh 解鎖 Hath Perks 及增加一些小工具
// @namespace      https://github.com/FlandreDaisuki
// @version        1.0.1
// @match          *://e-hentai.org/*
// @match          *://exhentai.org/*
// @icon           https://i.imgur.com/JsU0vTd.png
// @run-at         document-start
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
//
// Addition metas
//
// @supportURL     https://github.com/FlandreDaisuki/My-Browser-Extensions/issues
// @homepageURL    https://github.com/FlandreDaisuki/My-Browser-Extensions/blob/master/userscripts/UnlockHathPerks.md
// @author         FlandreDaisuki
// @license        MPLv2
// @compatible     firefox 52+
// @compatible     chrome 55+
// @incompatible   any not support async/await, CSS-grid browsers
// ==/UserScript==

'use strict';

/************************************/
/*****     Before DOM Ready     *****/
/************************************/

Set.prototype.difference = function(setB) {
	const difference = new Set(this);
	for(const elem of setB) {
		difference.delete(elem);
	}
	return difference;
};

function $find(el, selector, cb = () => {}) {
	const found = el.querySelector(selector);
	cb(found);
	return found;
}

function $$find(el, selector, cb = () => {}) {
	const found = Array.from(el.querySelectorAll(selector));
	cb(found);
	return found;
}

function $(selector) {
	return $find(document, selector);
}

function $$(selector) {
	return $$find(document, selector);
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

	static async gData(gInfos) {
		const queue = [];
		const result = [];

		while(gInfos.length) {
			const toQ = gInfos.slice(0, 25);
			gInfos.splice(0, 25);
			queue.push(toQ);
		}

		for(const glist of queue) {
			const r = await fetch('/api.php', {
				method: 'POST',
				credentials: 'same-origin',
				body: JSON.stringify({
					method: 'gdata',
					gidlist: glist,
				}),
			});

			const json = await r.json();

			if (json.error) {
				console.error('API.gdata(): glist', glist);
				throw new Error(json.error);
			} else {
				result.push(...json.gmetadata);
			}
		}

		return result;
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
	mt: true,
	tf: false,
	pe: true,
	mpv: false,
	fw: false,
	rth: false,
	sr: false,
	pi: false,
	tpf: false,
	flaggingTags: {
		red: {
			hide: false,
			tags:[],
		},
		green: {
			hide: false,
			tags:[],
		},
		brown: {
			hide: false,
			tags:[],
		},
		blue: {
			hide: false,
			tags:[],
		},
		yellow: {
			hide: false,
			tags:[],
		},
		purple: {
			hide: false,
			tags:[],
		},
	},
};

function uhpSaveConfig() {
	GM_setValue('uhp', uhpConfig);
}

function uhpLoadConfig() {
	return GM_getValue('uhp', uhpConfig);
}

Object.assign(uhpConfig, uhpLoadConfig());
uhpSaveConfig();

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
		$style(materialCSS);
		$el('link', {
			href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
			rel: 'stylesheet',
			integrity: 'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
			crossOrigin: 'anonymous',
		}, el => document.head.appendChild(el));
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
			el.addEventListener('click', () => {
				if($$('#uhp-panel input[pattern]').every(el=>el.validity.valid)) {
					el.classList.add('hidden');
				}
			});
		});
		document.body.appendChild(uhpPanelContainerEl);

		const uhpPanelEl = $el('div', {
			id: 'uhp-panel',
		}, el => {
			if(location.host === 'exhentai.org') {
				el.classList.add('dark');
			}
			el.addEventListener('click', event => { event.stopPropagation(); });
		});
		uhpPanelContainerEl.appendChild(uhpPanelEl);

		/* Setup UHP Configs */
		uhpPanelEl.innerHTML = uhpPanelElHTML + uhpTagFlaggingHTML;

		$$('#uhp-panel input[id^="uhp-conf-"]').forEach(el => {
			const abbr = el.id.replace('uhp-conf-', '');
			el.checked = uhpConfig[abbr];
			el.addEventListener('change', () => {
				uhpConfig[abbr] = el.checked;
				uhpSaveConfig();
			});
		});

		$$('#uhp-panel input[pattern]').forEach(el => {
			// tag color
			const tc = el.id.replace('uhp-tf-', '');
			el.addEventListener('change', () => {
				const newTags = el.value.split(',').map(x => x.trim()).filter(x => x);
				const oldTags = uhpConfig.flaggingTags[tc].tags;
				const allTags = Object.values(uhpConfig.flaggingTags).reduce((acc, val) => acc.concat(val.tags), []);
				const newAllSet = new Set(allTags).difference(oldTags);
				const newSet = new Set(newTags).difference(newAllSet);

				el.value = [...newSet].join(', ');
				uhpConfig.flaggingTags[tc].tags = [...newSet];
				uhpSaveConfig();
			});
		});

		$$('.uhp-tf-options input[type="checkbox"]').forEach(el => {
			// tag color
			const tc = el.id.replace(/uhp-tf-(\w+)-hide/, '$1');
			el.checked = uhpConfig.flaggingTags[tc].hide;
			el.addEventListener('change', () => {
				uhpConfig.flaggingTags[tc].hide = el.checked;
				uhpSaveConfig();
			});
		});

		/* Setup Reactable UHP Configs */
		$('#uhp-conf-fw').addEventListener('change', event => {
			const fwc = $('#uhp-full-width-container');
			if(fwc) {
				if(event.target.checked) {
					fwc.classList.add('fullwidth');
				} else {
					fwc.classList.remove('fullwidth');
				}
			}
		});

		$('#uhp-conf-tf').addEventListener('change', event => {
			const tfops = $$('.uhp-tf-options');
			if(event.target.checked) {
				tfops.forEach(el => el.classList.remove('hidden'));
			} else {
				tfops.forEach(el => el.classList.add('hidden'));
			}
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
		// if "No hits found", there is no mode
		if ($('#searchbox') && $('#dmi>span')) {
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

	/**********************/
	/* Paging Enlargement */
	/**********************/
	async function getNextPage(nextURL, mode) {
		const selector = mode === 't' ? 'div.id1' : 'table.itg tr:nth-of-type(n+2)';

		const result = {
			mode,
			elements: [],
			nextURL: null,
		};

		console.assert(nextURL, `nextURL should be string but is ${nextURL}`);

		if (!nextURL) {
			console.warn('nextURL:', nextURL);
			return result;
		}

		const response = await fetch(nextURL, {
			credentials: 'same-origin',
		});
		if (response.ok) {
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			result.elements = Array.from($$find(doc, selector));
			if (uhpConfig.abg) {
				result.elements = result.elements.filter(el => el.className);
			}
			result.elements =
			result.elements
				.filter(el => {
					if(uhpConfig.rth) {
						if (mode === 't') {
							return !$find(el, '.id3 img').src.endsWith('blank.gif');
						} else {
							return !$find(el, '.it5 > a').onmouseover;
						}
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

	async function addTagFlags(page) {
		const selector = page.mode === 't' ? '.id3 > a' : '.it5 > a';
		const gLinks = page.elements.map(el => $find(el, selector).href);
		const gInfos = gLinks.map(a => API.gInfo(a));
		const gData = await API.gData(gInfos);
		const tagsMap = {};
		for(const i in gLinks) {
			const gLink = gLinks[i];
			// tag1;tag2;tag3
			tagsMap[gLink] = gData[i].tags.join(';');
		}

		for(const pageEl of page.elements) {
			const parent = (page.mode === 't') ?
				$find(pageEl, '.id44') :
				$el('div', {className: 'it4t'}, el => {
					if($find(pageEl, '.it4t')) {
						$find(pageEl, '.it4t').replaceWith(el);
					} else {
						$find(pageEl, '.it4').appendChild(el);
					}
				});

			const aLink = $find(pageEl, selector);
			// remove exists
			$$find(parent, `.tf${page.mode}`).forEach(el => el.remove());

			for (const c in uhpConfig.flaggingTags) {
				const tags = uhpConfig.flaggingTags[c].tags;
				const matchs = tags.filter(t => tagsMap[aLink.href].includes(t));
				if (matchs.length) {
					const flagEl = $el('div', {title: matchs.join(', '), className:`tf${page.mode} ${c}`});
					parent.appendChild(flagEl);
					if (uhpConfig.flaggingTags[c].hide) {
						if (page.mode === 't') {
							$find(aLink, 'img').src = '//ehgt.org/g/blank.gif';
						} else {
							aLink.removeAttribute('onmouseover');
							aLink.removeAttribute('onmouseout');
						}
					}
				}
			}
		}
		console.info('before', page.elements);
		page.elements = page.elements.filter(el => {
			if(uhpConfig.rth) {
				if (page.mode === 't') {
					return !$find(el, '.id3 img').src.endsWith('blank.gif');
				} else {
					console.log($find(el, '.it5 > a'), $find(el, '.it5 > a').getAttribute('onmouseover'));
					return $find(el, '.it5 > a').getAttribute('onmouseover');
				}
			}
			return true;
		});
		console.info('after', page.elements);
	}

	// if "No hits found", there is no mode
	if ($('#searchbox') && $('#dmi>span')) {
		(async() => {
			const nextEl = $('.ptb td:last-child > a');
			let nextURL = nextEl ? nextEl.href : null;
			const mode = $('#dmi>span').textContent === 'Thumbnails' ? 't' : 'l';
			const parent = mode === 't' ? $('div.itg') : $('table.itg tbody');
			const status = $el('h1', {
				textContent: 'Loading...',
				id: 'uhp-status',
			});

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

			// this page
			const thisPage = await getNextPage(location.href, mode);
			if(uhpConfig.tf) {
				await addTagFlags(thisPage);
			}
			while (parent.firstChild) {
				parent.firstChild.remove();
			}
			thisPage.elements.forEach(el => parent.appendChild(el));
			nextURL = thisPage.nextURL;
			if (!nextURL) {
				status.textContent = 'End';
			}

			// next page
			if (uhpConfig.pe) {
				$('table.ptb').replaceWith(status);

				// remove popular section
				$$('div.c, #pt, #pp').forEach(el => el.remove());

				document.addEventListener('scroll', async() => {
					const anchorTop = status.getBoundingClientRect().top;
					const windowHeight = window.innerHeight;

					if (anchorTop < windowHeight * 2 && nextURL && !urlSet.has(nextURL)) {
						urlSet.add(nextURL);
						const nextPage = await getNextPage(nextURL, mode);
						if(uhpConfig.tf) {
							await addTagFlags(nextPage);
						}
						console.log(nextPage);

						//// work around first ////
						if(uhpConfig.pi) {
							if (mode === 'l') {
								parent.appendChild($el('tr', {
									className: 'uhp-open-in-new-page',
								}, el => {
									el.innerHTML = `<td colspan="4" style="font-size: 4rem;">
														<a href="${nextURL}" style="text-decoration: none; display: inline-flex; align-items: flex-end;">
															P${~~nextURL.replace(/.*(?:page=(\d+)|\/(\d+)$).*/g, '$1$2') + 1}
														</a>
													</td>`;
								}));
							} else {
								parent.appendChild($el('div', {
									className: 'uhp-open-in-new-page',
									style: 'grid-column: 1; display: flex; align-items: center; justify-content: center;',
								}, el => {
									el.innerHTML = `<div style="position: sticky;top: 0;font-size: 4rem;">
														<a href="${nextURL}" style="text-decoration: none; display: inline-flex; align-items: flex-end;">
															P${~~nextURL.replace(/.*(?:page=(\d+)|\/(\d+)$).*/g, '$1$2') + 1}
														</a>
													</div>`;
								}));
							}
						}

						if(uhpConfig.tpf) {
							parent.classList.add('uhp-tpf-dense');
						}
						//// work around first ////


						nextPage.elements.forEach(el => parent.appendChild(el));
						nextURL = nextPage.nextURL;
						if (!nextURL) {
							status.textContent = 'End';
						}
					}
				});
			}
		})();
	}


	/***************/
	/* More Thumbs */
	/***************/
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
			result.elements = $$find(doc, '#gdt > div');
			const nextEl = $$find(doc, '.ptb td:last-child > a');
			result.nextURL = nextEl ? nextEl.href : null;
		}
		return result;
	}

	if (uhpConfig.mt && location.pathname.startsWith('/g/')) {
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
		})();
	}

	/**********************/
	/* Scroll Restoration */
	/**********************/
	if(uhpConfig.sr) {
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
}

var uhpPanelElHTML = `
<h1>Hath Perks</h1>
<div class="option-grid">
	<div class="material-switch">
		<input id="uhp-conf-abg" type="checkbox">
		<label for="uhp-conf-abg"></label>
	</div>
	<span id="uhp-conf-abg-title">Ads-Be-Gone</span>
	<span id="uhp-conf-abg-desc">Make ad scripts won't work before request.</span>

	<div class="material-switch">
		<input id="uhp-conf-tf" type="checkbox">
		<label for="uhp-conf-tf"></label>
	</div>
	<span id="uhp-conf-tf-title">Tag Flagging</span>
	<span id="uhp-conf-tf-desc">Can flag 6 color for tags.<br/>
		Hide thumbnail of search results when the switch turn on.<br/>
		Conflict with official "Tag Flagging".
	</span>

	<div class="material-switch">
		<input id="uhp-conf-mpv" type="checkbox" disabled>
		<label for="uhp-conf-mpv"></label>
	</div>
	<span id="uhp-conf-mpv-title">Multi-Page Viewer</span>
	<span id="uhp-conf-mpv-desc">Work in Progress</span>

	<div class="material-switch">
		<input id="uhp-conf-mt" type="checkbox">
		<label for="uhp-conf-mt"></label>
	</div>
	<span id="uhp-conf-mt-title">More Thumbs</span>
	<span id="uhp-conf-mt-desc">Make thumbnails in book page infinitely scroll.</span>

	<div class="material-switch">
		<input id="uhp-conf-pe" type="checkbox">
		<label for="uhp-conf-pe"></label>
	</div>
	<span id="uhp-conf-pe-title">Paging Enlargement</span>
	<span id="uhp-conf-pe-desc">Make search results page infinitely scroll.<br/>Popular section will be removed.</span>
</div>

<h1>Others</h1>
<div class="option-grid">
	<div class="material-switch">
		<input id="uhp-conf-fw" type="checkbox">
		<label for="uhp-conf-fw"></label>
	</div>
	<span id="uhp-conf-fw-title">Full Width</span>
	<span id="uhp-conf-fw-desc">Make search results fitting browser width.<br/>Only affect on thumb display mode.</span>

	<div class="material-switch">
		<input id="uhp-conf-rth" type="checkbox">
		<label for="uhp-conf-rth"></label>
	</div>
	<span id="uhp-conf-rth-title">Remove Tag Hidden</span>
	<span id="uhp-conf-rth-desc">Remove search results which tagged with hidden when "Tag Flagging" work.</span>

	<div class="material-switch">
		<input id="uhp-conf-sr" type="checkbox">
		<label for="uhp-conf-sr"></label>
	</div>
	<span id="uhp-conf-sr-title">Scroll Restoration</span>
	<span id="uhp-conf-sr-desc">Scroll last position you seen in last page when "Paging Enlargement" work.</span>

	<div class="material-switch">
		<input id="uhp-conf-pi" type="checkbox">
		<label for="uhp-conf-pi"></label>
	</div>
	<span id="uhp-conf-pi-title">Page Indicator</span>
	<span id="uhp-conf-pi-desc">Add page indicator link to prevent "Scroll Restoration" work too hard.</span>

	<div class="material-switch">
		<input id="uhp-conf-tpf" type="checkbox">
		<label for="uhp-conf-tpf"></label>
	</div>
	<span id="uhp-conf-tpf-title">Thumb Page Flow</span>
	<span id="uhp-conf-tpf-desc">Make dense flow when "Page Indicator" work.<br/>Only affect on thumb display mode.</span>
</div>
`;

var uhpTagFlaggingHTML = `
<h1 class="uhp-tf-options ${uhpConfig.tf ? '' : 'hidden'}">Tag Flagging</h1>
<div class="uhp-tf-options tf-option-grid ${uhpConfig.tf ? '' : 'hidden'}">
	<div class="tfl red"></div>
	<input id="uhp-tf-red" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.red.tags.join(', ')}" placeholder="e.g. touhou, flandre scarlet"/>
	<div class="material-switch">
		<input id="uhp-tf-red-hide" type="checkbox">
		<label for="uhp-tf-red-hide"></label>
	</div>

	<div class="tfl green"></div>
	<input id="uhp-tf-green" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.green.tags.join(', ')}"/>
	<div class="material-switch">
		<input id="uhp-tf-green-hide" type="checkbox">
		<label for="uhp-tf-green-hide"></label>
	</div>

	<div class="tfl brown"></div>
	<input id="uhp-tf-brown" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.brown.tags.join(', ')}"/>
	<div class="material-switch">
		<input id="uhp-tf-brown-hide" type="checkbox">
		<label for="uhp-tf-brown-hide"></label>
	</div>

	<div class="tfl blue"></div>
	<input id="uhp-tf-blue" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.blue.tags.join(', ')}"/>
	<div class="material-switch">
		<input id="uhp-tf-blue-hide" type="checkbox">
		<label for="uhp-tf-blue-hide"></label>
	</div>

	<div class="tfl yellow"></div>
	<input id="uhp-tf-yellow" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.yellow.tags.join(', ')}"/>
	<div class="material-switch">
		<input id="uhp-tf-yellow-hide" type="checkbox">
		<label for="uhp-tf-yellow-hide"></label>
	</div>

	<div class="tfl purple"></div>
	<input id="uhp-tf-purple" pattern="(\\w(?:[^:]|[\\w\\s])+)(?:,\\s*\\1)*" value="${uhpConfig.flaggingTags.purple.tags.join(', ')}"/>
	<div class="material-switch">
		<input id="uhp-tf-purple-hide" type="checkbox">
		<label for="uhp-tf-purple-hide"></label>
	</div>
</div>
`;

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
	background-color: floralwhite;
	border-radius: 1rem;
	font-size: 1rem;
	color: darkred;
	max-width: 650px;
}
#uhp-panel.dark {
	background-color: dimgray;
	color: ghostwhite;
}
#uhp-panel > .option-grid {
	display: grid;
	grid-template-columns: max-content max-content 1fr;
	grid-gap: 0.5rem 1rem;
}
#uhp-panel > .tf-option-grid {
	display: grid;
	grid-template-columns: 20px 1fr max-content;
	grid-gap: 0.5rem 1rem;
}
#uhp-panel > .option-grid > *,
#uhp-panel > .tf-option-grid > * {
	display: flex;
	justify-content: center;
	align-items: center;
}
#uhp-panel > .tf-option-grid > .tfl {
	margin: auto;
}
#uhp-panel > .uhp-tf-options.hidden {
	display: none;
}
#uhp-full-width-container.fullwidth,
#uhp-full-width-container.fullwidth div.itg {
	max-width: none;
}
#uhp-full-width-container div.itg {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
	grid-gap: 2px;
}
#uhp-full-width-container div.itg.uhp-tpf-dense {
	grid-auto-flow: dense;
}
#uhp-full-width-container div.id1 {
	height: 345px;
	float: none;
	display: flex;
	flex-direction: column;
	margin: 3px auto;
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
div#pp,
div#gdt.uhp-page-parent {
	display: flex;
	flex-wrap: wrap;
}
div#gdt.uhp-page-parent>div{
	float: initial;
}
div.it4t {
	width: 102px;
}
div.tfl.red,
div.tft.red {
	background-position: 0 -1px;
}
div.tfl.green,
div.tft.green {
	background-position: 0px -52px;
}
div.tfl.brown,
div.tft.brown {
	background-position: 0px -18px;
}
div.tfl.blue,
div.tft.blue {
	background-position: 0px -69px;
}
div.tfl.yellow,
div.tft.yellow {
	background-position: 0px -35px;
}
div.tfl.purple,
div.tft.purple {
	background-position: 0px -86px;
}`;

/* https://bootsnipp.com/snippets/featured/material-design-switch */
var materialCSS = `
.material-switch {
	display: inline-block;
}

.material-switch > input[type="checkbox"] {
	display: none;
}

.material-switch > input[type="checkbox"] + label {
	display: inline-block;
	position: relative;
	margin: 6px;
	border-radius: 8px;
	width: 40px;
	height: 16px;
	opacity: 0.3;
	background-color: rgb(0, 0, 0);
	box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
	transition: all 0.4s ease-in-out;
}

.material-switch > input[type="checkbox"] + label::after {
	position: absolute;
	top: -4px;
	left: -4px;
	border-radius: 16px;
	width: 24px;
	height: 24px;
	content: "";
	background-color: rgb(255, 255, 255);
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
	transition: all 0.3s ease-in-out;
}

.material-switch > input[type="checkbox"]:checked + label {
	background-color: #0e0;
	opacity: 0.7;
}

.material-switch > input[type="checkbox"]:checked + label::after {
	background-color: inherit;
	left: 20px;
}
.material-switch > input[type="checkbox"]:disabled + label::after {
	content: "\\f023";
	line-height: 24px;
	font-size: 0.8em;
	font-family: FontAwesome;
	color: initial;
}`;
