'use strict'

const asyncWrapper = require('./lib/asyncWrapper')
const processImage = require('./lib/processImage')

const loader = asyncWrapper(async function loader(content) {
  if (typeof this.query === 'string') {
    throw new Error(
      'does not support inline querystring as options, define your options in webpack.config.js instead'
    )
  }

  const sharpInstance = processImage(content, this.query)
  const result = await sharpInstance.toBuffer()
  return result
})
loader.raw = true

module.exports = loader
