'use strict'

module.exports = fn =>
  async function wrappedLoader(...args) {
    const callback = this.async()
    try {
      const result = await fn.apply(this, args)
      callback(null, result)
    } catch (err) {
      callback(err)
    }
  }
