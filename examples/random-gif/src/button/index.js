const m = require("mithril");
const b = require("bss");
const { lensPath, not, over } = require("ramda");
const { button } = require("../util/ui");

const createActions = update => ({
  toggle: _event => update({ fn: over(lensPath(["active"]), not) })
});

exports.createButton = update => {
  const actions = createActions(update);

  return {
    model: () => ({
      active: false
    }),
    view: model => {
      const bc = model.active ? "green" : "red";
      const label = model.active ? "Active" : "Inactive";
      return m("button" + button, { style: b.bc(bc).style, onclick: actions.toggle }, label);
    }
  };
};
