// ==UserScript==
// @name        VSCode "editor.guides.bracketPairs"
// @description Implement editor.guides.bracketPairs
// @namespace   https://flandre.tw/github
// @match       https://github.com/*
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @author      FlandreDaisuki
// @version     1.0.2
// @grant       none
// ==/UserScript==

/* global sentinel */

const $$ = (s, doc = document) => [...doc.querySelectorAll(s)];
const range = (start, end) => Array.from({ length: end - start }, (_, i) => i + start);
const range0 = (end) => range(0, end);
const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);

const getHueByDepth = (depth) => depth * 129;
const getLineNumberByEl = (el) => Number(el.closest('td').id.replace(/\D+/, ''));

sentinel.on('table[data-tagsearch-lang="JavaScript"]', (jsTableEl) => {
  if (!jsTableEl) return;

  // # class-token mapping
  //
  // `.pl-kos`: keyword.operator.symbol
  // From now on the selector will meet following 10 kinds of token { } [ ] ( ) . , ; '?.'
  //
  // ref: https://github.com/atom/language-javascript/blob/72c8b9d06eb00e549d7f2b1677f0174603f5abce/grammars/tree-sitter-javascript.cson
  // ref: https://github.com/github/linguist/pull/4568#issuecomment-513739638
  // ref: https://github.com/github/linguist/issues/1822#issuecomment-66510457
  const bracketEls = $$('td.blob-code > span.pl-kos', jsTableEl);
  const totalLineCount = jsTableEl.querySelectorAll('tr').length;

  const toSymbolElement = (el) => Object.assign(Object.create(null), {
    el,
    symbol: el.textContent,
    lineNumber: getLineNumberByEl(el),
  });

  const toBracketPair = (depth, pairs) => Object.assign(Object.create(null), {
    depth,
    pairs,
    first: pairs[0],
    second: pairs[1],
  });

  const allBracketPairs = (() => {
    const stack = [];
    const bracketPairs = [];
    for (const bracketEl of bracketEls) {
      const symbol = bracketEl.textContent;

      if ('{}()[]'.includes(symbol)) {
        stack.push(toSymbolElement(bracketEl));

        const last2StackElString = stack.slice(-2).map((e) => e.symbol).join('');
        if (['{}', '()', '[]'].includes(last2StackElString)) {
          bracketPairs.push(toBracketPair(stack.length - 2, stack.splice(-2, 2)));
        }
      }
    }
    console.assert(stack.length === 0, 'stack should be empty');
    return bracketPairs;
  })();

  const differentLineBracketPairs = allBracketPairs.filter(({ first, second }) => {
    return first.lineNumber !== second.lineNumber;
  });

  for (const differentLineBracketPair of differentLineBracketPairs) {
    const { first, second, depth } = differentLineBracketPair;

    const parentEl = first.el.closest('td');
    const siblingsNodesOfFirst = [...parentEl.childNodes];
    const indexOfFirst = siblingsNodesOfFirst.indexOf(first.el);
    const indexOfIndent = siblingsNodesOfFirst.findIndex((node) => node.nodeName !== '#text');
    const nonIndentNodesBeforeFirst = siblingsNodesOfFirst.slice(indexOfIndent, indexOfFirst);
    const crossCharCount = sum(nonIndentNodesBeforeFirst.map((node) => node.textContent.length));

    first.el.classList.add('bracket-pair-first');
    first.el.style.setProperty('--bracket-pair-cross-char-count', crossCharCount);
    first.el.style.setProperty('--bracket-pair-color-hue', getHueByDepth(depth));

    second.el.classList.add('bracket-pair-second');
    second.el.style.setProperty('--bracket-pair-cross-line-count', second.lineNumber - first.lineNumber - 1);
    second.el.style.setProperty('--bracket-pair-color-hue', getHueByDepth(depth));
  }

  const byDepthDesc = (a, b) => b.depth - a.depth;
  const highlightBracketPairByLine = range0(totalLineCount).map((idx) => {
    const lineNumberBetweenBracketPairs = ({ first, second }) => {
      const lineNumber = idx + 1;
      return first.lineNumber <= lineNumber && lineNumber <= second.lineNumber;
    };

    return differentLineBracketPairs
      .filter(lineNumberBetweenBracketPairs)
      .sort(byDepthDesc)[0];
  });

  jsTableEl.addEventListener('mouseover', (event) => {
    const lineNumber = getLineNumberByEl(event.target);
    const bracketPair = highlightBracketPairByLine[lineNumber - 1];
    if (!bracketPair) return;

    const { first, second } = bracketPair;
    first.el.style.setProperty('--bracket-pair-enabled', '" "');
    second.el.style.setProperty('--bracket-pair-enabled', '" "');
  });
  jsTableEl.addEventListener('mouseout', (event) => {
    const lineNumber = getLineNumberByEl(event.target);
    const bracketPair = highlightBracketPairByLine[lineNumber - 1];
    if (!bracketPair) return;

    const { first, second } = bracketPair;
    first.el.style.removeProperty('--bracket-pair-enabled');
    second.el.style.removeProperty('--bracket-pair-enabled');
  });

  const styleEl = document.createElement('style');
  styleEl.textContent = `
  [data-color-mode="light"] {
    --bracket-pair-color-hue:;
    --bracket-pair-color-saturation: 10%;
    --bracket-pair-color-lightness: 10%;
  }
  [data-color-mode="dark"] {
    --bracket-pair-color-hue:;
    --bracket-pair-color-saturation: 90%;
    --bracket-pair-color-lightness: 90%;
  }
  .bracket-pair-first::before, .bracket-pair-second::before {
    content: var(--bracket-pair-enabled);
    position: absolute;
    border-color: hsl(var(--bracket-pair-color-hue, 0), var(--bracket-pair-color-saturation), var(--bracket-pair-color-lightness));
    border-width: 1px;
  }
  .bracket-pair-first::before {
    border-bottom-style: solid;
    transform-origin: left;
    transform: translateX(calc(-100% * var(--bracket-pair-cross-char-count, 0))) scaleX(var(--bracket-pair-cross-char-count, 0));
  }
  .bracket-pair-second::before {
    border-left-style: solid;
    transform-origin: top;
    transform: translateY(calc(-100% * var(--bracket-pair-cross-line-count, 0))) scaleY(var(--bracket-pair-cross-line-count, 0));
  }`;
  document.head.appendChild(styleEl);
});
