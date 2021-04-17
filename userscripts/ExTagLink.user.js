// ==UserScript==
// @name        ExTagLink
// @description Add torrent/magnet/pixiv links to tag area
// @namespace   FlandreDaisuki
// @author      FlandreDaisuki
// @include     /^https?:\/\/(g\.)?e[x-]hentai.org\/g\//
// @version     2021.04.17
// @grant       none
// ==/UserScript==

/* cSpell:ignore taglist exhentai */

const $$ = (s, doc = document) => Array.from(doc.querySelectorAll(s));

/* Main.js */

/** @typedef { {name:string, link:string} } LinkItem */
/**
 * @param {string} title
 * @param {LinkItem[]} linkItems
 * @param {[string, string]} [color=['#0F9', '#F09']]
 */
function appendToTag(title, linkItems, color = ['#0F9', '#F09']) {
  const tagTable = $$('#taglist table')[0] ?? (() => {
    const table = document.createElement('table');
    $$('#taglist')[0].innerHTML = '';
    $$('#taglist')[0].appendChild(table);
    return table;
  })();

  const tr = document.createElement('tr');
  const td0 = document.createElement('td');
  const td1 = document.createElement('td');

  tagTable.appendChild(tr);
  tr.appendChild(td0);
  tr.appendChild(td1);

  tr.style.color = location.host === 'exhentai.org' ? color[0] : color[1];
  tr.style.fontWeight = 'bold';

  td0.innerHTML = title;
  td0.className = 'tc';

  linkItems.forEach(function(elem) {
    const d = document.createElement('div');
    const a = document.createElement('a');

    td1.appendChild(d);
    d.appendChild(a);

    d.className = 'gt';
    a.href = elem.link;
    a.innerHTML = elem.name;
  });
}

const magnetLinks = [];
const pixivLinks = [];

for (const com of $$('.c6')) {
  const walker = document.createTreeWalker(com, NodeFilter.SHOW_TEXT);

  let textNode = walker.nextNode();
  while (textNode) {
    const magnetLink = textNode.textContent.match(/(magnet\S+)/g);
    if (magnetLink) {
      magnetLinks.push(magnetLink);
    }

    const pixivLink = textNode.textContent.match(/https:\/\/www\.pixiv\.net\/\S+/g);

    if (pixivLink) {
      pixivLinks.push(pixivLink);
    }

    textNode = walker.nextNode();
  }
}

if (pixivLinks.length > 0) {
  const linkItems = pixivLinks.map(function(elem) {
    return {
      name: elem.match(/\d+$/g)[0],
      link: elem,
    };
  });

  appendToTag('pixiv:', linkItems, ['#258fb8', '#258fb8']);
}

if (magnetLinks.length > 0) {
  const linkItems = magnetLinks.map(function(elem) {
    return {
      name: elem.slice(-6),
      link: elem,
    };
  });

  appendToTag('magnet:', linkItems);
}

const torrentPageAnchorElement = $$('p.g2:nth-child(3) > a:nth-child(2)')[0];
const torrentCount = Number(torrentPageAnchorElement.innerHTML.match(/\d+/g)[0]);
if (torrentCount > 0) {
  const withCookie = {
    credentials: 'same-origin',
  };

  const url = torrentPageAnchorElement.onclick.toString().match(/(http[^']+)/g)[0];
  fetch(url, withCookie)
    .then(async(res) => {
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const doc$$ = (s) => $$(s, doc);
      const links = doc$$('table a').map((x) => x.href);
      const sizes = doc$$('table tr:nth-child(1) > td:nth-child(2)').map((x) =>
        x.childNodes[1].data.trim(),
      );
      if (links.length !== sizes.length) {
        console.log('Error:', links, sizes);
        return [];
      } else {
        return sizes.map((_, i) => ({
          link: links[i],
          name: sizes[i],
        }));
      }
    })
    .then((torrentLinkItems) => {
      appendToTag('torrent:', torrentLinkItems);
    });
}
