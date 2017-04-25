'use strict'

const coWrapper = require('./lib/coWrapper')
const processImage = require('./lib/processImage')
const loaderUtils = require('loader-utils')

const loader = coWrapper(function* (content) {
  let query;
  if (typeof this.query === 'string') {
    query = loaderUtils.parseQuery(this.query)
  } else {
    query = this.query
  }

  const sharpInstance = processImage(content, query)

  return yield sharpInstance.toBuffer()
})
loader.raw = true

module.exports = loader
