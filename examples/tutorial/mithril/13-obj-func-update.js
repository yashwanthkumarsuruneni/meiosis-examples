/*global m*/

// -- Utility code

var nestUpdate = function(update, prop) {
  return function(modelUpdate) {
    var fn = modelUpdate.fn;

    update(Object.assign(modelUpdate, {
      fn: function(model) {
        model[prop] = fn(model[prop]);
        return model;
      }
    }));
  };
};

var nest = function(create, prop, update) {
  var component = create(nestUpdate(update, prop));
  var result = {};
  if (component.model) {
    result.model = function() {
      var initialModel = {};
      initialModel[prop] = component.model();
      return initialModel;
    };
  }
  if (component.view) {
    result.view = function(model) {
      return component.view(model[prop]);
    };
  }
  return result;
};

var generateId = function() {
  return "uid-" + new Date().getTime();
};

// -- Application code

var convert = function(value, to) {
  if (to === "C") {
    return Math.round( (value - 32) / 9 * 5 );
  }
  else {
    return Math.round( value * 9 / 5 + 32 );
  }
};

var createTemperature = function(label, init) {
  return function(update) {
    var increase = function(model, amount) {
      return function(_event) {
        update({ id: model.id, fn: function(model) {
          model.value += amount;
          return model;
        } });
      };
    };
    var changeUnits = function(model) {
      return function(_event) {
        var newUnits = model.units === "C" ? "F" : "C";
        var newValue = convert(model.value, newUnits);
        update({ id: model.id, fn: function(model) {
          model.value = newValue;
          model.units = newUnits;
          return model;
        } });
      };
    };

    var model = function() {
      return Object.assign({ id: generateId(), value: 22, units: "C" }, init);
    };

    var view = function(model) {
      return [
        label, " Temperature: ", model.value, m.trust("&deg;"), model.units,
        m("div",
          m("button", { onclick: increase(model, 1) }, "Increase"),
          m("button", { onclick: increase(model,-1) }, "Decrease")
        ),
        m("div",
          m("button", { onclick: changeUnits(model) }, "Change Units")
        )
      ];
    };
    return { model: model, view: view };
  };
};

var createTemperatureList = function(update) {
  var temperature = createTemperature()(function(modelUpdate) {
    var fn = modelUpdate.fn;
    update({ fn: function(model) {
      model.temperaturesById[modelUpdate.id] = fn(model.temperaturesById[modelUpdate.id]);
      return model;
    } });
  });

  var model = function() {
    return {
      temperatureIds: [],
      temperaturesById: {}
    };
  };

  var addTemperature = function(_event) {
    update({ fn: function(model) {
      var temperatureModel = temperature.model();
      var id = temperatureModel.id;

      model.temperatureIds.push(id);
      model.temperaturesById[id] = temperatureModel;

      return model;
    } });
  };

  var removeTemperature = function(id) {
    return function(_event) {
      update({ fn: function(model) {
        delete model.temperaturesById[id];
        model.temperatureIds.splice(model.temperatureIds.indexOf(id), 1);
        return model;
      } });
    };
  };

  var renderTemperature = function(model) {
    return function(id) {
      return m("div", { key: id }, [
        temperature.view(model.temperaturesById[id]),
        m("button", { onclick: removeTemperature(id) }, "Remove")
      ]);
    };
  };

  var view = function(model) {
    return m("div", [
      m("button", { onclick: addTemperature }, "Add"),
      model.temperatureIds.map(renderTemperature(model))
    ]);
  };
  return { model: model, view: view };
};

var createApp = function(update) {
  return nest(createTemperatureList, "temperatures", update);
};

// -- Meiosis pattern setup code

var update = m.stream();
var app = createApp(update);

var models = m.stream.scan(function(model, modelUpdate) {
  return modelUpdate.fn(model);
}, app.model(), update);

var element = document.getElementById("app");

models.map(function(model) {
  m.render(element, app.view(model));
});
