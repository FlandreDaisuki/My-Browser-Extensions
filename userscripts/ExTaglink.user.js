// ==UserScript==
// @name        ExTaglink
// @description Add torrent/magnet/pixiv links to tag area
// @namespace   FlandreDaisuki
// @author      FlandreDaisuki
// @include     /^https?:\/\/(g\.)?e[x-]hentai.org\/g\//
// @version     2016.09.10
// @grant       none
// ==/UserScript==

/* ES6: const */
/* ES6: Array.from */

function $$(s) {
	return Array.from(document.querySelectorAll(s));
}

/* Main.js */

function appendtoTag(title, objs, color = ['#0F9', '#F09']) {
	/* objs: [] of obj */
	/* obj: {name, link} */
	/* color: [exh, e-h] */
	var tagtable = $$('#taglist table')[0];
	if (!tagtable) {
		tagtable = document.createElement('table');
		$$('#taglist')[0].innerHTML = '';
		$$('#taglist')[0].appendChild(tagtable);
	}
	var tr = document.createElement('tr');
	var td0 = document.createElement('td');
	var td1 = document.createElement('td');

	tagtable.appendChild(tr);
	tr.appendChild(td0);
	tr.appendChild(td1);

	tr.style.color = location.host === 'exhentai.org' ? color[0] : color[1];
	tr.style.fontWeight = 'bold';

	td0.innerHTML = title;
	td0.className = 'tc';

	objs.forEach(function(elem) {
		var d = document.createElement('div');
		var a = document.createElement('a');

		td1.appendChild(d);
		d.appendChild(a);

		d.className = 'gt';
		a.href = elem.link;
		a.innerHTML = elem.name;
	});
}

var mags = [];
var pixivs = [];

for (var com of $$('.c6')) {
	var magres = com.innerHTML.match(/(magnet\S+)/g);
	if (magres) {
		mags = mags.concat(magres);
	}

	var pixivres = com.innerText.match(/https:\/\/www\.pixiv\.net\/\S+/g);

	if (pixivres) {
		pixivs = pixivs.concat(pixivres);
	}
}

// console.log(mags);
// console.log(pixivs);

if (pixivs.length > 0) {
	var objs = pixivs.map(function(elem) {
		return {
			name: elem.match(/\d+$/g)[0],
			link: elem,
		};
	});

	appendtoTag('pixiv:', objs, ['#258fb8', '#258fb8']);
}

if (mags.length > 0) {
	var objs = mags.map(function(elem) {
		return {
			name: elem.slice(-6),
			link: elem,
		};
	});

	appendtoTag('magnet:', objs);
}

const gidt = location.pathname.split('/').filter(x => x.length > 1);

var tor_elem = $$('p.g2:nth-child(3) > a:nth-child(2)')[0];
var tor_n = ~~tor_elem.innerHTML.match(/\d+/g)[0];
if (tor_n > 0) {
	var with_cookie = {
		credentials: 'same-origin',
	};

	var tor_obj = fetch(
		tor_elem.onclick.toString().match(/(http[^\']+)/g)[0],
		with_cookie,
	)
		.then(res => {
			return res.text();
		})
		.then(html => {
			return new DOMParser().parseFromString(html, 'text/html');
		})
		.then(doc => {
			const $$ = function(s) {
				return Array.from(doc.querySelectorAll(s));
			};

			links = $$('table a').map(x => x.href);
			sizes = $$('table tr:nth-child(1) > td:nth-child(2)').map(x =>
				x.childNodes[1].data.trim(),
			);
			if (links.length !== sizes.length) {
				console.log('Error:', links, sizes);
				return [];
			} else {
				var r = [];
				for (var len = 0; len < sizes.length; ++len) {
					r.push({
						link: links[len],
						name: sizes[len],
					});
				}
				return r;
			}
		});

	tor_obj.then(tobjs => {
		appendtoTag('torrent:', tobjs);
	});
}
