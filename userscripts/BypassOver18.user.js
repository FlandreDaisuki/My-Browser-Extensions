// ==UserScript==
// @name         Bypass 18+
// @description  Bypass 18+ checking forever
// @namespace    https://github.com/FlandreDaisuki
// @version      1.0.2
// @author       FlandreDaisuki
// @match        *://www.amazon.co.jp/*
// @match        *://gyutto.com/*
// @match        *://www.dlsite.com/*
// @match        *://www.getchu.com/*
// @match        *://ec.toranoana.jp/*
// @match        *://www.ptt.cc/*
// @match        *://www.melonbooks.co.jp/*
// @match        *://www.suruga-ya.jp/*
// @grant        none
// @noframes
// ==/UserScript==

/* eslint-disable no-unused-expressions */

class CookieBuilder {
  constructor(k, v) {
    this['🍪'] = new Map([[k, v]]);
    this['🚗'] = true;
  }
  expires() {
    this['🍪'].set('expires', new Date('2345-06-07T00:00:00').toGMTString());
    return this;
  }
  path(t = '/') {
    this['🍪'].set('path', t);
    return this.nopath();
  }
  nopath() {
    this['🚗'] = false;
    return this;
  }
  domain(t) {
    this['🍪'].set('domain', t);
    return this;
  }
  toString() {
    this.expires();
    if (this['🚗']) {
      this.path();
    }
    return [...this['🍪']].map(p => p.join('=')).join('; ');
  }
  get ['⏰']() {
    document.cookie = this.toString();
    return 0;
  }
}

(() => {
  const bake = (...args) => new CookieBuilder(...args);
  const cookieMap = document.cookie.split('; ')
    .reduce((c, s) => {
      const i = s.indexOf('=');
      c.set(s.slice(0, i), s.slice(i + 1));
      return c;
    }, new Map());

  switch (location.host) {
    case 'www.amazon.co.jp':
    {
      const t = cookieMap.get('csm-hit');
      if (t) {
        bake('csm-hit', t)['⏰'];
      }
      break;
    }
    case 'gyutto.com':
      bake('adult_check_flag', 1).domain('gyutto.com')['⏰'];
      bake('user_agent_flag', 1).domain('gyutto.com')['⏰'];
      break;
    case 'www.dlsite.com':
      bake('adultchecked', 1).domain('dlsite.com')['⏰'];
      break;
    case 'www.getchu.com':
      bake('getchu_adalt_flag', 'getchu.com')['⏰'];
      break;
    case 'ec.toranoana.jp':
      bake('adflg', 0).domain('ec.toranoana.jp')['⏰'];
      break;
    case 'www.ptt.cc':
      bake('over18', 1)['⏰'];
      break;
    case 'www.melonbooks.co.jp':
      bake('AUTH_ADULT', 1)['⏰'];
      break;
    case 'www.suruga-ya.jp':
      bake('adult', 1)['⏰'];
      break;
    default:
      break;
  }
})();
