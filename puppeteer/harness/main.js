/*
  QUnit Harness
   - 
 */
module.exports = {
  begin: require('./qunitBegin'),
  done: require('./qunitDone'),
  log: require('./qunitLog'),
  module: {
    start: require("./moduleStart"),
    done: require("./moduleDone")
  },
  test: {
    start: require("./testStart"),
    done: require("./testDone")
  }
}