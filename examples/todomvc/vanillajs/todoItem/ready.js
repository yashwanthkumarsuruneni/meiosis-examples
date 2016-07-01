/*global define, exports, module, require, document*/

// This boilerplate is to support running this code with either, just the browser, or RequireJS,
// or node.js / npm (browserify, webpack, etc.) Do not think this boilerplate is necessary to run
// Meiosis. It is for convenience to be able to run the example with your preferred module system.
(function(root, moduleName, depNames, depVars, factory) {
  if (typeof define === "function" && define.amd) {
    define(depNames, factory);
  }
  else if (typeof exports === "object") {
    var requires = depNames.map(function(depName) {
      return require(depName);
    });
    module.exports = factory.apply(root, requires);
  }
  else {
    var vars = depVars.map(function(depVar) {
      return root[depVar];
    });
    root[moduleName] = factory.apply(root, vars);
  }
}(this || window, // ^^ the code above is boilerplate. the "real" code starts below. vv
  "todoItemReady",
  ["meiosisVanillaJs"],
  ["meiosisVanillaJs"],

  function(meiosisVanillaJs) {
    var renderer = meiosisVanillaJs.renderer;
    var root = document.getElementById("app");

    return function(actions) {
      renderer.delegate(root, "input.toggle", "change", function(evt) {
        var todoId = parseInt(evt.target.dataset.id, 10);
        var completed = evt.target.checked;
        actions.setCompleted(todoId, completed);
      });

      renderer.delegate(root, ".view label", "dblclick", function(evt) {
        var todoId = parseInt(evt.target.dataset.id, 10);
        var title = evt.target.innerHTML;
        actions.editTodo({title: title, id: todoId});
      });

      renderer.delegate(root, "button.destroy", "click", function(evt) {
        var todoId = parseInt(evt.target.dataset.id, 10);
        actions.deleteTodoId(todoId);
      });
    };
  }
));
