// ==UserScript==
// @name        javbus.waterfall
// @description Infinite scroll @ javbus.com
// @namespace   https://github.com/FlandreDaisuki
// @include     https://www.javbus.com/*
// @include     https://www.javbus2.com/*
// @include     https://www.javbus3.com/*
// @include     https://www.javbus5.com/*
// @include     https://www.javbus.me/*
// @version     2017.06.04
// @grant       none
// ==/UserScript==
const $ = jQuery

class Lock {
  constructor (d = false) {
    this.locked = d
  }
  lock () {
    this.locked = true
  }
  unlock () {
    this.locked = false
  }
}

class Waterfall {
  constructor (selectorcfg = {}) {
    this.lock = new Lock()
    this.baseURI = this.getBaseURI()
    this.selector = {
      next: 'a.next',
      item: '',
      cont: '', // container
      pagi: '.pagination'
    }
    Object.assign(this.selector, selectorcfg)
    this.pagegen = this.fetchSync(location.href)
    this.anchor = $(this.selector.pagi)[0]
    this._count = 0
    this._1func = function (cont, elems) {
      cont.empty().append(elems)
    }
    this._2func = function (cont, elems) {
      cont.append(elems)
    }

    if ($(this.selector.item).length) {
      document.addEventListener('scroll', this.scroll.bind(this))
      document.addEventListener('wheel', this.wheel.bind(this))
      this.appendElems(this._1func)
    }
  }

  getBaseURI () {
    let _ = location
    return `${_.protocol}//${_.hostname}${_.port && `:${_.port}`}`
  }

  getNextURL (href) {
    let a = document.createElement('a')
    a.href = href
    return `${this.baseURI}${a.pathname}${a.search}`
  }

  fetchURL (url) {
    console.log(`fetchUrl = ${url}`)
    const fetchwithcookie = fetch(url, { credentials: 'same-origin' })
    return fetchwithcookie
      .then(response => response.text())
      .then(html => new DOMParser().parseFromString(html, 'text/html'))
      .then(doc => {
        let $doc = $(doc)
        let href = $doc.find(this.selector.next).attr('href')
        let nextURL = href ? this.getNextURL(href) : undefined
        let elems = $doc.find(this.selector.item)

        return {
          nextURL,
          elems
        }
      })
  }

  * fetchSync (urli) {
    let url = urli
    do {
      yield new Promise((resolve, reject) => {
        if (this.lock.locked) {
          reject()
        } else {
          this.lock.lock()
          resolve()
        }
      })
        .then(() => {
          return this.fetchURL(url).then(info => {
            url = info.nextURL
            return info.elems
          })
        })
        .then(elems => {
          this.lock.unlock()
          return elems
        })
        .catch(err => {
          // Locked!
        })
    } while (url)
  }

  appendElems () {
    let nextpage = this.pagegen.next()
    if (!nextpage.done) {
      nextpage.value.then(elems => {
        const cb = this._count === 0 ? this._1func : this._2func
        cb($(this.selector.cont), elems)
        this._count += 1
      })
    }
    return nextpage.done
  }

  end () {
    console.info('The End')
    document.removeEventListener('scroll', this.scroll.bind(this))
    document.removeEventListener('wheel', this.wheel.bind(this))
    $(this.anchor).replaceWith($(`<h1>The End</h1>`))
  }

  static reachBottom (elem, limit) {
    return elem.getBoundingClientRect().top - $(window).height() < limit
  }

  scroll () {
    if (Waterfall.reachBottom(this.anchor, 500) && this.appendElems(this._2func)) {
      this.end()
    }
  }

  wheel () {
    if (Waterfall.reachBottom(this.anchor, 1000) && this.appendElems(this._2func)) {
      this.end()
    }
  }

  setFirstCallback (f) {
    this._1func = f
  }

  setSecondCallback (f) {
    this._2func = f
  }
}

const w = new Waterfall({
  next: 'a#next',
  item: '.item',
  cont: '#waterfall'
})

w.setSecondCallback(function (cont, elems) {
  if (location.pathname.includes('/star/')) {
    cont.append(elems.slice(1))
  } else {
    cont.append(elems)
  }
})

function addStyle (styleStr) {
  $('head').append(`<style>${styleStr}</style>`)
}

addStyle(`
  #waterfall {
    height: initial !important;
    width: initial !important;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  #waterfall .item.item {
    position: relative !important;
    top: initial !important;
    left: initial !important;
    float: none;
    flex: 25%;
  }
  #waterfall .movie-box,
  #waterfall .avatar-box {
    width: initial !important;
    display: flex;
  }
  #waterfall .movie-box .photo-frame {
    overflow: visible;
  }`)
