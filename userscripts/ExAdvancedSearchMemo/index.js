import { $, $getValue, $html, $setValue, $style } from '../helpers/common';

const NAMESPACE = 'ExAdvancedSearchMemo';
const load = (defaultValue = []) => $getValue(NAMESPACE, defaultValue);
const save = (value = load()) => $setValue(NAMESPACE, value);

(() => {
  // cSpell: disable
  // #searchbox.idi
  //   table.itc
  //   div
  //     input#f_search
  //     input(type="submit" value="Search")
  //     input(type="button" value="Clear")
  //   div
  //     a [Show Advanced Options]
  //     a [Show File Search]
  // cSpell: enable
  const inputsBoxEl = $('table.itc + div');
  if (!inputsBoxEl) { return; }
  inputsBoxEl.classList.add('🔱-input-box');

  const memoLinksEl = $html('<ul class="🔱-memo-links"></ul>');
  inputsBoxEl.insertAdjacentElement('afterend', memoLinksEl);
  const loadAllMemos = async() => {
    const allMemos = await load();
    const memoListHtmlText = allMemos
      .map((memo) => `<li><a href="${ memo.query }">${ memo.name }</a></li>`)
      .join('');
    memoLinksEl.innerHTML = memoListHtmlText;
  };
  loadAllMemos();


  const onMemoClick = async() => {
    const query = location.search;
    // eslint-disable-next-line no-alert
    const name = prompt('Type the name');
    const allMemos = await load();
    await save(allMemos.concat({ name, query }));
    await loadAllMemos();
  };
  const memoBtnEl = $html(
    '<input type="button" class="🔱-memo-btn" value="Memo"/>',
  );
  inputsBoxEl.appendChild(memoBtnEl);
  memoBtnEl.onclick = onMemoClick;
})();

$style(`
.🔱-input-box {
  display: flex;
  align-items: center;
}
ul.🔱-memo-links {
  list-style: none;

  display: flex;
  gap: 8px;
  padding: 4px;
  border: 1px dashed;
}
ul.🔱-memo-links > li {
  display: inline-block;

  border-bottom: 1px solid currentColor;
}
`);
