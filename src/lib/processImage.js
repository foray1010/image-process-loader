'use strict'

const sharp = require('sharp')

module.exports = (content, query) => {
  return Object.keys(query)
    .reduce((sharpInstance, methodName) => {
      const params = (
        Array.isArray(query[methodName]) ?
          query[methodName] :
          [query[methodName]]
      )
      return sharpInstance[methodName](...params)
    }, sharp(content))
}
