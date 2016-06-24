/*global define, exports, module, require*/

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
}(this, // ^^ the code above is boilerplate. the "real" code starts below. vv
  "todoInputActions", [], [],

  function() {
    return function(sendUpdate) {
      var actions = {
        saveTodo: function(title, id) {
          sendUpdate({ saveTodo: { title: title, id: id } });
        },
        cancelEdit: function() {
          sendUpdate({ editTodo: { } });
        }
      };

      var ENTER_KEY = 13;
      var ESCAPE_KEY = 27;

      actions.events = {
        onEditKeyUp: function(todoId) {
          return function(evt) {
            if (evt.keyCode === ESCAPE_KEY || evt.which === ESCAPE_KEY) {
              actions.cancelEdit();
            }
            else if (evt.keyCode === ENTER_KEY || evt.which === ENTER_KEY) {
              actions.saveTodo(evt.target.value, todoId);
            }
          };
        },
        onEditChange: function(todoId) {
          return function(evt) {
            actions.editTodo(evt.target.value, todoId);
          };
        },
        onEditBlur: function(todoId) {
          return function(evt) {
            actions.saveTodo(evt.target.value, todoId);
          };
        }
      };

      return actions;
    };
  }
));