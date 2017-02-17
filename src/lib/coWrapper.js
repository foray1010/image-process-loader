'use strict'

const co = require('co')

module.exports = (fn) => {
  return co.wrap(function* (...args) {
    const callback = this.async()
    try {
      const result = yield fn.apply(this, args)
      callback(null, result)
    } catch (err) {
      callback(err)
    }
  })
}
