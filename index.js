/**
 * About: This script return all links from website with depth controls
 * 
 * @author: spurushottam13
 * 
 * ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 * 
 * The MIT License (MIT)
 * Copyright (c) 2019 Purushottam Shukla
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. 
 * 
 * ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 */

const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const URL = require('url').URL;

function Spider(options) {
  this.maxDepth = options.depth || 2
  this.homePage = [options.url]
  this.allLinks = []
  this.currentDepth = 0
  this.currentURL = options.currentURL
  this.onSuccess = options.onSuccess
  this.onFailure = options.onFailure
  this.onFinsh = options.onFinsh

  this._visitedURL = new Set([])
  this._hostname = new URL(this.homePage).hostname
  this._origin = new URL(this.homePage).origin
}

Spider.prototype.crawl = async function(links) {
  if (links === undefined) {
    links = this.homePage
  }
  const promiseStack = []
  links.map(i => promiseStack.push(this._crawlPage(i)))
  let pageLink = await Promise.all(promiseStack)

  pageLink = flat(pageLink)
  pageLink = pageLink.map(i => this._hanldeRelativeUrl(i))
  pageLink = pageLink.filter(i => this._filterLinks(i))
  this.allLinks = new Set([...this.allLinks, ...pageLink])
  this.currentDepth = this.currentDepth + 1
  if (this.currentDepth >= this.maxDepth) return this.onFinsh(this.allLinks)
  this.crawl(pageLink)
}

Spider.prototype._crawlPage = function(url) {
  return new Promise((resolve, reject) => {
    this._visitedURL.add(url)
    request(url, (error, resp, body) => {
      if (error) {
        resolve([])
        return this.onFailure({
          url,
          StatusCode: resp && resp.statusCode,
          error: error.code
        })
      }
      try {
        const virtualConsole = new jsdom.VirtualConsole()
        const dom = new JSDOM(body, { virtualConsole })
        const aTag = dom.window.document.getElementsByTagName('a')
        const links = new Set([])
        Array.from(aTag).map(i => links.add(i.href))
        resolve(Array.from(links))
        this.onSuccess(url)
      } catch (err) {
        resolve([])
      }
    })
  })
}

Spider.prototype._hanldeRelativeUrl = function(url) {
  if (url.indexOf(this._hostname) !== -1 || url.startsWith('http')) return url
  if (url.startsWith('/')) return this._origin + url
  return this.homePage + '/' + url
}
Spider.prototype._filterLinks = function(url) {
  return (
    Boolean(url) &&
    Boolean(this._isHostSame(url) || (url.startsWith('/') && url.indexOf('.') !== -1)) &&
    !this._visitedURL.has(url)
  )
}

Spider.prototype._isHostSame = function(url) {
  return url.startsWith('h') ? Boolean(new URL(this.homePage).host === new URL(url).host) : false
}

/* ::::::::::::::::::::::: ( Utiltiy Function ) :::::::::::::::::::::::::::::: */

const flat = (input, depth = 1, stack = []) => {
  for (let item of input) {
    if (item instanceof Array && depth > 0) {
      flat(item, depth - 1, stack)
    } else {
      stack.push(item)
    }
  }
  return stack
}

module.exports = {
  Spider
}
