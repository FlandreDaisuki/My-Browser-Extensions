// ==UserScript==
// @name         Bypass 18+ Checking
// @description  Bypass 18+ check forever
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @author       FlandreDaisuki
// @match        *://dl.getchu.com/*
// @match        *://gyutto.com/*
// @match        *://*.dlsite.com/*
// @match        *://*.dlsite.com.tw/*
// @match        *://*.javlibrary.com/*
// @match        *://hanime.tv/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	const neverExpireGMTString = new Date('2999-01-01T00:00:00').toGMTString();
	const host = location.host;

	if (host === 'dl.getchu.com' || host === 'gyutto.com') {
		const toF5 = !document.cookie.includes('adult_check_flag');
		document.cookie = `adult_check_flag=1; domain=.${host}; path=/; expires=${neverExpireGMTString};`;
		if (toF5) {
			location.assign(location.href);
		}
	} else if (host === 'www.dlsite.com' || host === 'www.dlsite.com.tw') {
		const domain = host.replace(/^www./, '');
		const toF5 = !document.cookie.includes('adultchecked');
		document.cookie = `adultchecked=1; domain=.${domain}; path=/; expires=${neverExpireGMTString};`;
		if (toF5) {
			location.assign(location.href);
		}
	} else if (host === 'www.javlibrary.com') {
		const toF5 = !document.cookie.includes('over18');
		document.cookie = `over18=18; path=/; expires=${neverExpireGMTString};`;
		if (toF5) {
			location.assign(location.href);
		}
	} else if (host === 'hanime.tv') {
		document.cookie = `htv2_landing_desktop_tbndr=1; path=/; expires=${neverExpireGMTString};`;
	}
})();
