'use strict'

const asyncWrapper = require('./lib/asyncWrapper')
const processImage = require('./lib/processImage')
const loaderUtils = require('loader-utils')

const loader = asyncWrapper(async function loader(content) {
  const globalOptions = loaderUtils.getOptions(this);
  const resourceOptions = loaderUtils.parseQuery(this.resourceQuery || "?")
  let presetOptionsList = []

  // We have 2 possible choices:
  // - set of presets in `presets`
  // - single preset in `preset`
  if (resourceOptions.preset) {
    // @todo duplicate code
    presetOptionsList = [resourceOptions.preset].map((key) => (globalOptions.presets[key]))
  }
  else if (Array.isArray[resourceOptions.presets]) {
    // @todo duplicate code
    presetOptionsList = resourceOptions.presets.map((key) => (globalOptions.presets[key]))
  }
  const options = Object.assign({}, globalOptions, ...presetOptionsList, resourceOptions)
  // `preset(s)` is not a valid method, we should remove it
  delete options.preset
  delete options.presets
  const sharpInstance = processImage(content, options)
  const result = await sharpInstance.toBuffer()
  return result
})
loader.raw = true

module.exports = loader
