'use strict'

const coWrapper = require('./lib/coWrapper')
const processImage = require('./lib/processImage')
const loaderUtils = require('loader-utils')

const loader = coWrapper(function* (content) {
  const globalOptions = loaderUtils.getOptions(this);
  const resourceOptions = loaderUtils.parseQuery(this.resourceQuery || "?")
  let presetOptionsList = [];

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

  return yield sharpInstance.toBuffer()
})
loader.raw = true

module.exports = loader
