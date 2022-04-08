// ==UserScript==
// @name        VSCode "editor.guides.bracketPairs"
// @description Implement editor.guides.bracketPairs (Support JavaScript, Racket)
// @namespace   https://flandre.tw/github
// @match       https://github.com/*
// @require     https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @author      FlandreDaisuki
// @version     2.0.2
// @grant       none
// ==/UserScript==

/* global sentinel */

const $$ = (s, doc = document) => [...doc.querySelectorAll(s)];
const range = (start, end) => Array.from({ length: end - start }, (_, i) => i + start);
const range0 = (end) => range(0, end);
const getHueByDepth = (depth) => depth * 129;
const sum = (...args) => args.flat(Infinity).reduce((a, b) => a + b, 0);
const getLineNumberByEl = (el) => Number(el.closest('td').id.replace(/\D+/, ''));

const toSymbolElement = (el) => Object.assign(Object.create(null), {
  el,
  symbol: el.textContent,
  lineNumber: getLineNumberByEl(el),
});

const toBracketPair = (depth, pairs) => Object.assign(Object.create(null), {
  depth,
  pairs,
  left: pairs[0],
  right: pairs[1],
});

const getAllBracketPairsByBracketEls = (bracketEls) => {
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

  // eslint-disable-next-line no-console
  console.assert(stack.length === 0, 'stack should be empty');
  return bracketPairs;
};

const setupBracketPairsStyle = (bracketPairs) => {
  for (const bracketPair of bracketPairs) {
    const { left, right, depth } = bracketPair;

    const parentElOfLeft = left.el.closest('td');
    const siblingsNodesOfLeft = [...parentElOfLeft.childNodes];
    const indexOfLeft = siblingsNodesOfLeft.indexOf(left.el);
    const leftIndentWidth = siblingsNodesOfLeft[0].textContent.match(/^\s+$/) ? siblingsNodesOfLeft[0].textContent.length : 0;
    const nodesBeforeLeft = siblingsNodesOfLeft.slice(0, indexOfLeft);

    const leftCharCount = sum(nodesBeforeLeft.map((node) => node.textContent.length));
    const leftCharCountWithoutIndent = leftCharCount - leftIndentWidth;

    const parentElOfRight = right.el.closest('td');
    const siblingsNodesOfRight = [...parentElOfRight.childNodes];
    const indexOfRight = siblingsNodesOfRight.indexOf(right.el);
    const rightIndentWidth = siblingsNodesOfRight[0].textContent.match(/^\s+$/) ? siblingsNodesOfRight[0].textContent.length : 0;
    const nodesBeforeRight = siblingsNodesOfRight.slice(0, indexOfRight);

    const rightCharCount = sum(nodesBeforeRight.map((node) => node.textContent.length));
    const rightCharCountWithoutIndent = rightCharCount - rightIndentWidth;

    const diffCharCount = Math.abs(rightCharCount - leftCharCount);
    const diffLineCount = Math.abs(right.lineNumber - left.lineNumber);

    left.el.classList.add('bracket-pair-left');
    left.el.style.setProperty('--bracket-pair-left-char-count', leftCharCount);
    left.el.style.setProperty('--bracket-pair-left-char-count-without-indent', leftCharCountWithoutIndent);
    left.el.style.setProperty('--bracket-pair-diff-char-count', diffCharCount);
    left.el.style.setProperty('--bracket-pair-diff-line-count', diffLineCount);
    left.el.style.setProperty('--bracket-pair-color-hue', getHueByDepth(depth));

    right.el.classList.add('bracket-pair-right');
    right.el.style.setProperty('--bracket-pair-right-char-count', rightCharCount);
    right.el.style.setProperty('--bracket-pair-right-char-count-without-indent', rightCharCountWithoutIndent);
    right.el.style.setProperty('--bracket-pair-diff-char-count', diffCharCount);
    right.el.style.setProperty('--bracket-pair-diff-line-count', diffLineCount);
    right.el.style.setProperty('--bracket-pair-color-hue', getHueByDepth(depth));
  }
};

const setupHighLightToLinesByBracketPairs = (bracketPairs, tableEl) => {
  const totalLineCount = tableEl.querySelectorAll('tr').length;
  const byDepthDesc = (a, b) => b.depth - a.depth;
  const highlightBracketPairByLine = range0(totalLineCount).map((idx) => {
    const lineNumberBetweenBracketPairs = ({ left, right }) => {
      const lineNumber = idx + 1;
      return left.lineNumber <= lineNumber && lineNumber <= right.lineNumber;
    };

    return bracketPairs
      .filter(lineNumberBetweenBracketPairs)
      .sort(byDepthDesc)[0];
  });

  tableEl.addEventListener('mouseover', (event) => {
    const lineNumber = getLineNumberByEl(event.target);
    const bracketPair = highlightBracketPairByLine[lineNumber - 1];
    if (!bracketPair) { return; }

    for (const oneOfPair of bracketPair.pairs) {
      const bracketEl = oneOfPair.el;
      bracketEl.style.setProperty('--bracket-pair-connect-content-enabled', '\' \'');
      bracketEl.style.setProperty('--bracket-pair-connect-line-enabled', '1px');
      bracketEl.style.setProperty('--bracket-pair-self-enabled', '1px');
    }
  });

  tableEl.addEventListener('mouseout', (event) => {
    const lineNumber = getLineNumberByEl(event.target);
    const bracketPair = highlightBracketPairByLine[lineNumber - 1];
    if (!bracketPair) { return; }

    for (const oneOfPair of bracketPair.pairs) {
      const bracketEl = oneOfPair.el;
      bracketEl.style.removeProperty('--bracket-pair-connect-content-enabled');
      bracketEl.style.removeProperty('--bracket-pair-connect-line-enabled');
      bracketEl.style.removeProperty('--bracket-pair-self-enabled');
    }
  });
};

const setupStyleSheet = ({
  leftX = 'solid',
  leftTranslateX = 'calc(-100% * var(--bracket-pair-left-char-count, 0))',
  leftScaleX = 'var(--bracket-pair-left-char-count, 1)',
  leftY = 'solid',
  leftTranslateY = 'calc(-100% * var(--bracket-pair-diff-line-count, 0))',
  leftScaleY = 'var(--bracket-pair-diff-line-count, 1)',
  rightX = 'solid',
  rightTranslateX = 'calc(-100% * var(--bracket-pair-right-char-count, 0))',
  rightScaleX = 'var(--bracket-pair-right-char-count, 1)',
  rightY = 'solid',
  rightTranslateY = 'calc(-100% * var(--bracket-pair-diff-line-count, 0))',
  rightScaleY = 'var(--bracket-pair-diff-line-count, 1)',
  colorBrackets = false,
} = {}) => {
  const STYLE_ID = 'bracket-pair-style';

  const styleEl = ((el) => {
    if (el) { return el; }

    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
    return el;
  })(document.getElementById(STYLE_ID));

  const color = 'hsl(var(--bracket-pair-color-hue, 0), var(--bracket-pair-color-saturation), var(--bracket-pair-color-lightness))';

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
  .bracket-pair-left, .bracket-pair-right {
    box-shadow: 0 0 var(${ colorBrackets ? '--bracket-pair-self-enabled' : '0' }, 0) ${ color };
  }
  .bracket-pair-left::before, .bracket-pair-right::before,
  .bracket-pair-left::after, .bracket-pair-right::after {
    content: var(--bracket-pair-connect-content-enabled, '');
    position: absolute;
    border-color: ${ color };
    border-width: var(--bracket-pair-connect-line-enabled, 0);
    pointer-events: none;
  }
  .bracket-pair-left::before {
    border-bottom-style: ${ leftX };
    transform-origin: left;
    transform:
      translateX(${ leftTranslateX })
      scaleX(${ leftScaleX });
  }
  .bracket-pair-left::after {
    border-left-style: ${ leftY };
    transform-origin: top;
    transform:
      translateX(-99%)
      translateY(${ leftTranslateY })
      scaleY(${ leftScaleY });
  }
  .bracket-pair-right::before {
    border-bottom-style: ${ rightX };
    transform-origin: left;
    transform:
      translateX(${ rightTranslateX })
      scaleX(${ rightScaleX })
  }
  .bracket-pair-right::after {
    border-left-style: ${ rightY };
    transform-origin: top;
    transform:
      translateX(-99%)
      translateY(${ rightTranslateY })
      scaleY(${ rightScaleY });
  }`;
};

sentinel.on('table[data-tagsearch-lang="JavaScript"]', (jsTableEl) => {
  if (!jsTableEl) { return; }

  // # class-token mapping
  //
  // `.pl-kos`: keyword.operator.symbol
  // From now on the selector will meet following 10 kinds of token { } [ ] ( ) . , ; '?.'
  //
  // ref: https://github.com/atom/language-javascript/blob/72c8b9d06eb00e549d7f2b1677f0174603f5abce/grammars/tree-sitter-javascript.cson
  // ref: https://github.com/github/linguist/pull/4568#issuecomment-513739638
  // ref: https://github.com/github/linguist/issues/1822#issuecomment-66510457
  const bracketEls = $$('td.blob-code > span.pl-kos', jsTableEl);
  const allBracketPairs = getAllBracketPairsByBracketEls(bracketEls);

  const differentLineBracketPairs = allBracketPairs.filter(({ left, right }) => {
    return left.lineNumber !== right.lineNumber;
  });

  setupBracketPairsStyle(differentLineBracketPairs);
  setupHighLightToLinesByBracketPairs(differentLineBracketPairs, jsTableEl);
  setupStyleSheet({
    leftTranslateX: 'calc(-100% * var(--bracket-pair-left-char-count-without-indent, 0))',
    leftScaleX: 'var(--bracket-pair-left-char-count-without-indent, 1)',
    leftY: 'none',
    rightX: 'none',
    rightTranslateY: 'calc(-100% * (var(--bracket-pair-diff-line-count, 0) - 1))',
    rightScaleY: 'calc(var(--bracket-pair-diff-line-count, 1) - 1)',
  });
});

sentinel.on('table[data-tagsearch-lang="Racket"]', (rktTableEl) => {
  if (!rktTableEl) { return; }
  // ref site: https://github.com/racket-tw/sauron/blob/develop/project/manager.rkt

  const lineCodeEls = $$('td.blob-code', rktTableEl);
  for (const lineCodeEl of lineCodeEls) {
    const childNodes = [...lineCodeEl.childNodes].flatMap((node) => {
      if (node.nodeType !== Node.TEXT_NODE) { return node; }

      const a = document.createElement('a');
      a.innerHTML = node.textContent.replace(/(\(|\[|\)|\])/g, '<span class="bkp">$1</span>');
      return [...a.childNodes];
    });

    lineCodeEl.innerHTML = childNodes.map((node) => node.outerHTML ?? node.textContent).join('');
  }

  const bracketEls = $$('td.blob-code > span.bkp', rktTableEl);
  const allBracketPairs = getAllBracketPairsByBracketEls(bracketEls);

  const differentLineBracketPairs = allBracketPairs.filter(({ left, right }) => {
    return left.lineNumber !== right.lineNumber;
  });

  setupBracketPairsStyle(differentLineBracketPairs);
  setupHighLightToLinesByBracketPairs(differentLineBracketPairs, rktTableEl);
  setupStyleSheet({
    leftX: 'none',
    leftTranslateY: '100%',
    rightTranslateX: 'calc(-100% * var(--bracket-pair-diff-char-count, 0))',
    rightScaleX: 'var(--bracket-pair-diff-char-count, 1)',
    rightY: 'none',
    colorBrackets: true,
  });
});
