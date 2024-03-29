'use strict'

const loaderUtils = require('loader-utils')

const asyncWrapper = require('./lib/asyncWrapper.js')
const processImage = require('./lib/processImage.js')

const loader = asyncWrapper(async function loader(content) {
  const { presets: presetsOption = {}, ...globalOptions } =
    loaderUtils.getOptions(this) || {}
  const { preset, presets, ...resourceOptions } = this.resourceQuery
    ? loaderUtils.parseQuery(this.resourceQuery)
    : {}

  // We have 2 possible choices:
  // - set of presets in `presets`
  // - single preset in `preset`
  const presetNames = preset ? [preset] : presets || []
  const presetOptionsList = presetNames.map((key) => presetsOption[key])

  const options = Object.assign(
    {},
    globalOptions,
    ...presetOptionsList,
    resourceOptions,
  )

  const sharpInstance = processImage(content, options)
  const result = await sharpInstance.toBuffer()
  return result
})
loader.raw = true

module.exports = loader
