// ==UserScript==
// @name         javbooks.waterfall
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Infinite scroll @ javbooks
// @author       FlandreDaisuki
// @match        https://jmvbt.com/*
// @exclude      https://jmvbt.com/categorylist*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @noframes
// ==/UserScript==

/* global $ */

(($) => {
  const $container = $('#PoShow_Box');
  const targetClassName = $('#PoShow_Box > div').get(0).className;
  const ancher = $('#Bottom_main').get(0);
  const getNextUrl = (() => {
    let p = 1;
    return () => {
      p += 1;
      return location.href.replace(/(.*_)\d+(\.htm)/, `$1${p}$2`);
    };
  })();

  $(`#PoShow_Box > *:not(.${targetClassName})`).remove();

  window.addEventListener('scroll', throttle(() => {
    if (ancher.getBoundingClientRect().top < 1500) {
      fetch(getNextUrl())
        .then(resp => resp.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .then((doc) => {
          $container.append($(doc).find(`.${targetClassName}`));
        });
    }
  }, 500));

  injectCSS($);
})($.noConflict());

function injectCSS($) {
  $('<style>')
    .appendTo('head')
    .text(`
#PoShow_Box {
  width: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}`);
}

// ref: https://stackoverflow.com/questions/27078285/simple-throttle-in-js#27078401
/* eslint-disable */
function throttle(func, wait, options) {
  let context; let args; let
    result;
  let timeout = null;
  let previous = 0;

  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function () {
    const now = Date.now();

    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}


