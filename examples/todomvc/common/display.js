/*global window*/
(function(ref) {
  var viewModel = function(model) {
    var viewModel = model;
    var by = model.filter;
    var completed = by === "completed";

    var filterBy = (by && by !== "all") ? function(todo) {
      return (!!todo.completed) === completed;
    } :
    function() {
      return true;
    };
    viewModel.filteredTodos = model.todos.filter(filterBy);

    var notCompleted = function(todo) { return !todo.completed; };
    var itemsLeft = viewModel.filteredTodos.filter(notCompleted).length;
    viewModel.itemsLeftText = viewModel.filteredTodos.length > 0 ?
      (String(itemsLeft) + " item" + (itemsLeft === 1 ? "" : "s") + " left") : "";
    viewModel.clearCompleted = (viewModel.filteredTodos.length - itemsLeft) > 0;

    viewModel.allSelected = model.filter === "all";
    viewModel.activeSelected = model.filter === "active";
    viewModel.completedSelected = model.filter === "completed";

    return viewModel;
  };

  ref.display = function(view, header, todoItem, footer) {
    return function(model, _actions) {
      var vmodel = viewModel(model);

      var renderedTodos = vmodel.filteredTodos.map(todoItem(vmodel));
      var main = view.main(renderedTodos);
      var todoapp = view.todoapp(header(vmodel), main, footer(vmodel));
      var info = view.info();

      return view.root(todoapp, info);
    };
  };
})(window);