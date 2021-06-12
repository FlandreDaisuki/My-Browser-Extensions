// ==UserScript==
// @name         Jellyfin Rename to Filename
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Rename all videos title to filename in a library
// @author       FlandreDaisuki
// @match        http://localhost:8096/web/index.html
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @icon         https://www.google.com/s2/favicons?domain=jellyfin.org
// @grant        none
// ==/UserScript==

/* global sentinel */
/* global ApiClient, Emby */

const $ = (s, el = document) => el?.querySelector(s);
const $el = (tag, attr = {}, cb = () => {}) => {
  const el = document.createElement(tag);
  Object.assign(el, attr);
  cb(el);
  return el;
};

const tryParseRespToJson = async(resp) => {
  const body = await resp.text();
  try { return JSON.parse(body); } catch (error) { return body; }
};

const API = {
  ITEM_FIELD: {
    'Id': '', 'Name': '', 'OriginalTitle': '', 'ForcedSortName': '',
    'CommunityRating': '', 'CriticRating': '', 'IndexNumber': null,
    'AirsBeforeSeasonNumber': '', 'AirsAfterSeasonNumber': '',
    'AirsBeforeEpisodeNumber': '', 'ParentIndexNumber': null, 'DisplayOrder': '',
    'Album': '', 'AlbumArtists': [], 'ArtistItems': [], 'Overview': '',
    'Status': '', 'AirDays': [], 'AirTime': '', 'Genres': [], 'Tags': [],
    'Studios': [], 'PremiereDate': null, 'DateCreated': '', 'EndDate': null,
    'ProductionYear': '', 'AspectRatio': '', 'Video3DFormat': '',
    'OfficialRating': '', 'CustomRating': '', 'People': [], 'LockData': false,
    'LockedFields': [], 'ProviderIds': { 'Imdb': '', 'Tmdb': '', 'TmdbCollection': '' },
    'PreferredMetadataLanguage': '', 'PreferredMetadataCountryCode': '',
    'Taglines': [],
  },
  parentId: () => (new URLSearchParams(Emby.Page.getWindowLocationSearch()))
    .get('parentId'),
  headers: () => ({
    'Accept': 'application/json',
    'X-Emby-Authorization': [
      'MediaBrowser Client="Jellyfin Web"',
      'Device="Firefox"',
      `DeviceId="${ApiClient._deviceId}"`,
      `Version="${ApiClient._serverVersion}"`,
      `Token="${ApiClient._serverInfo.AccessToken}"`,
    ].join(', '),
  }),
  getItemsInfo: async() => {
    const query = `Fields=Path,Overview,DateCreated&ParentId=${API.parentId()}`;
    const url = `${ApiClient._serverAddress}/Users/${ApiClient._currentUser.Id}/Items?${query}`;
    const resp = await fetch(url, {
      'method': 'GET',
      'mode': 'cors',
      'credentials': 'omit',
      'headers': API.headers(),
    });
    if (!resp.ok) {
      return console.error(resp.status, await tryParseRespToJson(resp));
    }
    return resp.json();
  },
  renameItem: async(itemId, overrides = {}) => {
    const url = `${ApiClient._serverAddress}/Items/${itemId}`;
    const resp = await fetch(url, {
      'method': 'POST',
      'mode': 'cors',
      'credentials': 'omit',
      'headers': {
        ...API.headers(),
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        ...API.ITEM_FIELD,
        ...overrides,
        Id: itemId,
      }),
    });
    if (!resp.ok) {
      return console.error(resp.status, await tryParseRespToJson(resp));
    }
    return resp.ok;
  },
};

sentinel.on('.itemsViewSettingsContainer', main);
function main() {
  const buttonListEl = $('.itemsViewSettingsContainer');
  const btnRenameEl = $el('button', {
    className: 'btnRename button-flat listTextButton-autohide emby-button',
  });
  const btnRenameTextEl = $el('span', {
    textContent: '整頁標題命名成檔案名',
  });
  btnRenameEl.appendChild(btnRenameTextEl);

  if (!$('.btnRename', buttonListEl)) {
    buttonListEl.appendChild(btnRenameEl);
  }

  const onRenameClick = async() => {
    const itemsInfo = await API.getItemsInfo();
    const items = itemsInfo?.Items;
    if (!items) { return console.error('No video???'); }
    for (const item of items) {
      const title = item.Name;
      const absPath = item.Path;
      // base = name + ext
      const base = absPath.replace(/^.*\//, '');
      const name = base.replace(/\.[^.]*$/, '');

      if (title !== name) {
        await API.renameItem(item.Id, {
          Name: name,
          Overview: item.Overview,
          DateCreated: item.DateCreated,
        });
      }
    }
    location.reload();
  };
  btnRenameEl.addEventListener('click', onRenameClick);
}
