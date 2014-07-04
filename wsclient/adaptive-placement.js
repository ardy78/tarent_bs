module.exports = function(arena, cost, accept) {
  var shuffle = require('knuth-shuffle').knuthShuffle;
  var State = require("./state.js");
  var FreeCounter = require("./free-counter.js");
  var Visualizer = require("./visualizer.js");
  var createShip = function(fld, dir, length) {
    var flds = [];
    while (flds.length < length && fld) {
      flds.push(fld);
      fld = fld[dir]();
    }
    if (flds.length != length) {
      return undefined;
    }
    return flds;
  };
  var sumCost = function(flds) {
    return flds.map(cost).reduce(function(a, b) {
      return a + b;
    });
  };

  var byCost = function(a, b) {
    return sumCost(a) - sumCost(b);
  };

  var allCandidates = function(state0, size) {
    var state = FreeCounter(arena).scan(state0);
    var candidates = [];
    var examineCandidate = function(fld, dir, size) {
      if (state(fld).distance[dir]() >= size) {
        candidates.push(createShip(fld, dir, size));
      }
    };
    arena.scan(function(fld) {
      examineCandidate(fld, 'e', size);
      examineCandidate(fld, 's', size);
    });
    shuffle(candidates);
    candidates.sort(byCost);
    return candidates;
  };

  var applyCandidate = function(state0, flds) {
    var state = state0.clone();
    flds.forEach(function(fld) {
      state(fld).type = "water";
      ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(function(dir) {
        var adj = fld[dir]();
        if (adj ) {
          state(adj).type = "water";
        }
      });
    });
    return state;
  };

  var placeShips = function(state0, todo, path) {
    if (typeof accept !== "function") {
      accept = function() {
        return true;
      };
    }
    if (todo.length === 0) {
      return accept(path) ? path : undefined;
    }
    todo = todo.slice();
    var size = todo.shift();
    var candidates = allCandidates(state0, size);
    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      var state = applyCandidate(state0, candidate);
      var path1 = path.slice();
      path1.push(candidate);
      var placement = placeShips(state, todo, path1);
      if (placement)
        return placement;
    }
  };

  var Ship = function(fields) {
    return {
      asFields: function() {
        return fields;
      },
      asPlacement: function() {
        var res = [];
        fields.forEach(function(f) {
          res.push(f.toString());
        });

        //console.log("placed ship", res);
        return res.join(",");
      },
    };
  };
  return {
    placeShips: function() {
      return placeShips(State(), [2, 2, 3, 3, 4, 4, 5, 5], []).map(Ship);
    }
  };
};
