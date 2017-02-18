'use strict'

const sharp = require('sharp')

module.exports = (content, query) => {
  return Object.keys(query)
    .reduce((sharpInstance, methodName) => {
      if (!sharpInstance[methodName]) {
        throw new Error(`Method "${methodName}" is undefined`)
      }

      const params = (
        Array.isArray(query[methodName]) ?
          query[methodName] :
          [query[methodName]]
      )
      return sharpInstance[methodName](...params)
    }, sharp(content))
}
