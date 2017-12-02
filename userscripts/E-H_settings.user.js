// ==UserScript==
// @name         E-H settings
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Save settings in localStorage
// @author       FlandreDaisuki
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/store2/2.5.2/store2.min.js
// @grant        none
// ==/UserScript==

/* globals store, Cookies */

(function () {
  'use strict'
  window.store = store
  const c = Cookies.get('uconfig') || ''
  const s = store.get('uconfig') || ''

  if (s && !c) {
    Cookies.set('uconfig', s)
    location.assign(location.href)
  } else if (!s && c) {
    store.set('uconfig', c)
  } else if (s && c) {
    // conflict, I have no idea which is newer.
  } else {
    //! s && !c, keep empty
  }

  if (location.pathname === '/uconfig.php') {
    const submit = document.querySelector('#apply input')
    submit.addEventListener('click', () => {
      store.set('uconfig', c)
    })
  }
})()
