VesselDetector = require("./vessel-detector.js");
State = require("./state.js");

module.exports = function(arena, ships) {
  var flatten = function(input) {
    return Array.prototype.concat.apply([], input);
  };

  var state = State();
  flatten(ships).forEach(function(f) {
    state(f).type = "ship";
  });
  state = VesselDetector(arena).scan(state);
  var vessels = state.vessels.forEach(function(v) {
    var d = v.orientation === "vertical" ? v.tail.row() - v.head.row() : v.tail.col() - v.head.col();
    v.size = 1 + d;
  });
  var visualize = (function() {
    return function(f) {
      if (state(f).type === "ship") {
        return state(f).attacked ? "*" : "o";
      }

      return state(f).attacked ? "x" : " ";
    };

  })();
  return {
    visualize: visualize,
    ships: function() {
      return ships;
    },
    vessels: function() {
      return state.vessels;
    },
    vesselAt: function(f) {
      return state(f).vessel;
    },
    attacked: function(f) {
      state(f).attacked = true;
    }
  };
};
