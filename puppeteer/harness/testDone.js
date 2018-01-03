module.exports = context => {
  if (context.failed) {
    var msg = "  Test Failed: " + context.name + self.assertionErrors.join("    ");
    self.testErrors.push(msg + "F");
    self.assertionErrors = [];
  } else {
    //TODO
  }
}