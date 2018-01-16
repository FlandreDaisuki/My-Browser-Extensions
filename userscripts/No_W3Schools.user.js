// ==UserScript==
// @name         No W3Schools
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  http://www.w3fools.com/
// @author       FlandreDaisuki
// @include      *://*.google.com*/search*
// @match        *://duckduckgo.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const W3S = [
        'w3schools.com',
        'w3school.com',
    ];

    if (location.hostname.includes('google.com')) {
        // google
        const results = document.querySelectorAll('._NId .g');
        for (const r of results) {
            const cite = r.querySelector('cite');
            if (cite && W3S.some(domain => cite.textContent.includes(domain))) {
                r.remove();
            }
        }
    } else if (location.hostname.includes('duckduckgo.com')) {
        // duckduckgo
        const linksWrapper = document.querySelector('#links_wrapper');
        const observer = new MutationObserver(function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.id === 'links') {
                    for (const r of mutation.addedNodes) {
                        if (W3S.some(domain => r.dataset.domain.includes(domain))) {
                            r.remove();
                        }
                    }
                }
            }
        });

        observer.observe(linksWrapper, {
            childList: true,
            attributes: true,
            subtree: true
        });
    }
})();
