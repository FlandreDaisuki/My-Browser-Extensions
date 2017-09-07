// ==UserScript==
// @name        Bypass PTT Over-18 Checking
// @description 自動跳過 PTT 的分級檢查 (請謹慎使用)
// @namespace   https://www.ptt.cc/bbs
// @author      Shao-Chung Chen
// @license     MIT (http://opensource.org/licenses/MIT)
// @version     1.1.0
// @include     http://www.ptt.cc/*
// @include     https://www.ptt.cc/*
//
// @history     1.1.0 fix the Year 2038 Problem for cookie expiration date
// @history     1.0.0 initial commmit
// ==/UserScript==

// Source: https://gist.github.com/dannvix/3fef6c5cf8764596dac9

(function(location) {
    /* e.g. https://www.ptt.cc/ask/over18?from=%2Fbbs%2FGossiping%2FM.1419866542.A.4B4.html */
    if (location.hostname.toLowerCase().indexOf("ptt.cc") >= 0 &&
        location.pathname.toLowerCase().indexOf("ask/over18") >= 0) {
        var articlePathnameRegex = /from=([^?]+)/i;
        var matchResult = articlePathnameRegex.exec(location.search);
        if (matchResult) {
            /* add cookie to prevent going back to checking page after redirect */
            /* ref. https://github.com/ptt/pttweb/blob/6988e0373bf30fea56b68c24ac656591cb0324a9/cookie.go */
            var neverExpireGMTString = (new Date('2038-01-01T00:00:00')).toGMTString();
            document.cookie = "over18=1; path=/; expires=" + neverExpireGMTString + ";";

            /* redirect to real article URL */
            var articlePathname = decodeURIComponent(matchResult[1]); /* e.g. /bbs/Gossiping/M.1419866542.A.4B4.html */
            var fullArticleURL = location.protocol + "//" + location.hostname + location.port + articlePathname;
            console.log(fullArticleURL);
            location.href = fullArticleURL;
        }
    }
})(window.location);
