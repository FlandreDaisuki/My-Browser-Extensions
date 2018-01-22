// ==UserScript==
// @name         Avgle.waterfall
// @namespace    https://github.com/FlandreDaisuki
// @version      0.5
// @description  Make Avgle waterfall
// @author       FlandreDaisuki
// @match        https://avgle.com/videos*
// @match        https://avgle.com/search/videos*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const log = console.log.bind(console, `[${GM_info.script.name}]`);

    log(`version: ${GM_info.script.version}`);

    const $parent = $('#wrapper>.container .row .row');
    const footer = $('.footer-container')[0];
    const history = new Set();
    const chidSet = new Set($('a[href^="/video/"]')
                            .map((i, e) => $(e).attr('href').replace(/.*\/(\d+)\/.*/, '$1'))
                            .toArray());
    let nextlink = $('.pagination a.prevnext')[1];

    $(document.body).on('wheel', eventCallback);
    $(window).scroll(eventCallback);

    async function eventCallback() {
        if(nextlink && !history.has(nextlink) && (footer.getBoundingClientRect().top - window.innerHeight) < 1000) {
            history.add(nextlink);
            const nextPage = await getNextPage(nextlink);
            for(const thumbnail of nextPage.thumbnails) {
                const chid = $(thumbnail)
                    .find('a[href^="/video/"]')
                    .attr('href')
                    .replace(/.*\/(\d+)\/.*/, '$1');

                if(!chidSet.has(chid)) {
                    chidSet.add(chid);
                    $parent.append(thumbnail);
                }
            }
            nextlink = nextPage.nextlink;
        }
    }

    async function getNextPage(url) {
        log(`url: ${url}`);
        const response = await fetch(url);
        const html = await response.text();
        const doc = (new DOMParser()).parseFromString(html, "text/html");
        const $doc = $(doc);
        const nextlink = $doc.find('.pagination a.prevnext').attr('href');
        const thumbnails = $doc.find('#wrapper>.container .row .row > div').toArray();

        thumbnails.forEach(thumbEl => {
            const img = $(thumbEl).find('img.lazy')[0];
            img.src = img.dataset.original;
        });

        return {
            nextlink,
            thumbnails
        };
    }
})();
