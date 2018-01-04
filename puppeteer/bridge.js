const EventEmitter = require("events");

const harness = require('./harness')

module.exports = class Bridge extends EventEmitter {
  constructor() {
    super();

    this.moduleErrors = [];
    this.testErrors = [];
    this.assertionErrors = [];
  }

  async exposeFunctions(page) {
    const self = this

    await page.exposeFunction('harness_moduleDone', harness.module.done)
    await page.exposeFunction('harness_testDone', harness.test.done)
    await page.exposeFunction('harness_log', harness.log)
    await page.exposeFunction('harness_done', harness.done)
  }

  /*
    // Work on three different options:
    1. an array that is a string represenation of a function for Function() emit result to test
    2. emit to grunt to test.
    3. a script that can be injected into the dom, this resolves itself
    4. a script that will evaluate based on a specific context
  */
  async evaluate() {
    await page.evaluate(() => {
      QUnit.config.testTimeout = 10000;

      // Cannot pass the window.harness_blah methods directly, because they are
      // automatically defined as async methods, which QUnit does not support
      QUnit.moduleDone((context) => {
        window.harness_moduleDone(context);
      });
      QUnit.testDone((context) => {
        window.harness_testDone(context);
      });
      QUnit.log((context) => {
        window.harness_log(context);
      });
      QUnit.done((context) => {
        window.harness_done(context);
      });

      console.log("\nRunning: " + JSON.stringify(QUnit.urlParams) + "\n");
    });
  }


}