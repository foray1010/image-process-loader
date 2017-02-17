'use strict'

const coWrapper = require('./lib/coWrapper')
const processImage = require('./lib/processImage')

const loader = coWrapper(function* (content) {
  if (!this.query) return content

  const sharpInstance = processImage(content, this.query)

  return yield sharpInstance.toBuffer()
})
loader.raw = true

module.exports = loader
