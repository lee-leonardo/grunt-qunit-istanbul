module.export = context => {
  if (context.failed) {
    var msg = "Module Failed: " + context.name + "\n" + self.testErrors.join("\n");
    self.moduleErrors.push(msg);
    self.testErrors = [];
  }
}