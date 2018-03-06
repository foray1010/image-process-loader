'use strict'

const coWrapper = require('./lib/coWrapper')
const processImage = require('./lib/processImage')

const loader = coWrapper(function* loader(content) {
  if (typeof this.query === 'string') {
    throw new Error('does not support inline querystring as options, define your options in webpack.config.js instead')
  }

  const sharpInstance = processImage(content, this.query)

  return yield sharpInstance.toBuffer()
})
loader.raw = true

module.exports = loader
