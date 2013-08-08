var mockedModules = {};

function mockModule(moduleName, definition) {
  mockedModules[moduleName] = define.registry[moduleName].callback;
  define.registry[moduleName].callback = function() { return definition; };
  delete define.seen[moduleName];
}

function resetModules() {
  for (var moduleName in mockedModules) {
    if (!mockedModules.hasOwnProperty(moduleName)) { continue; }
  
    define.registry[moduleName].callback = mockedModules[moduleName];
    delete define.seen[moduleName];
  }

  mockedModules = {};
}

export { mockModule, resetModules };
