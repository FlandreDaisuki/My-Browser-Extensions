// ==UserScript==
// @name         Avgle.waterfall
// @namespace    https://github.com/FlandreDaisuki
// @version      0.3
// @description  Make Avgle waterfall
// @author       FlandreDaisuki
// @match        https://avgle.com/videos*
// @match        https://avgle.com/search/videos*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const log = console.log.bind(console, `[${GM_info.script.name}]`);
    const debug = console.debug.bind(console, `[${GM_info.script.name} debug]`);

    log(`version: ${GM_info.script.version}`);
    debug(`jQuery version: ${jQuery.fn.jquery}`);

    const $parent = $('#wrapper>.container .row .row');
    const footer = $('.footer-container')[0];
    const history = [];
    let nextlink = $('.pagination a.prevnext')[1];

    $(document.body).on('wheel', eventCallback);
    $(window).scroll(eventCallback);

    async function eventCallback() {
        if(nextlink && !history.includes(nextlink) && (footer.getBoundingClientRect().top - window.innerHeight) < 1000) {
            history.push(nextlink);
            const nextPage = await getNextPage(nextlink);
            $parent.append(nextPage.thumbnails);
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
