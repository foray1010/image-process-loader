'use strict'

const sharp = require('sharp')

module.exports = (content, query) => {
  return Object.keys(query).reduce((sharpInstance, methodName) => {
    if (!sharpInstance[methodName]) {
      throw new Error(`Method "${methodName}" is undefined`)
    }

    const paramsBefore = Array.isArray(query[methodName]) ? query[methodName] : [query[methodName]]

    const params = paramsBefore.map((key) => {
      const parsed = Number(key)
      if (Number.isNaN(parsed)) {
        return key
      } else {
        return parsed
      }
    })

    return sharpInstance[methodName](...params)
  }, sharp(content))
}
