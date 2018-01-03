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

    // await page.exposeFunction('harness_moduleDone', context => {
    //   if (context.failed) {
    //     var msg = "Module Failed: " + context.name + "\n" + self.testErrors.join("\n");
    //     self.moduleErrors.push(msg);
    //     self.testErrors = [];
    //   }
    // });


    await page.exposeFunction('harness_testDone', harness.test.done)

    // await page.exposeFunction('harness_testDone', context => {
    //   if (context.failed) {
    //     var msg = "  Test Failed: " + context.name + self.assertionErrors.join("    ");
    //     self.testErrors.push(msg + "F");
    //     self.assertionErrors = [];
    //   } else {
    //     //TODO
    //   }
    // });

    await page.exposeFunction('harness_log', harness.log)

    // await page.exposeFunction('harness_log', context => {
    //   if (context.result) {
    //     return;
    //   } // If success don't log

    //   var msg = "\n    Assertion Failed:";
    //   if (context.message) {
    //     msg += " " + context.message;
    //   }

    //   if (context.expected) {
    //     msg += "\n      Expected: " + context.expected + ", Actual: " + context.actual;
    //   }

    //   self.assertionErrors.push(msg);
    // });

    await page.exposeFunction('harness_done', harness.done)

    await page.exposeFunction('harness_done', context => {
      console.log("\n");

      if (self.moduleErrors.length > 0) {
        for (var idx = 0; idx < self.moduleErrors.length; idx++) {
          console.error(self.moduleErrors[idx] + "\n");
        }
      }

      var stats = [
        "Time: " + context.runtime + "ms",
        "Total: " + context.total,
        "Passed: " + context.passed,
        "Failed: " + context.failed
      ];
      console.log(stats.join(", "));

      browser.close();

      const success = context.failed == 0;
      ipc.server.emit(socket, 'done', {
        successful: success
      });
      process.exit(success ? 0 : 1);
    });
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