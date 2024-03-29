var RandomShipPlacement = require("../tools/randomShipPlacement");
var Projection = require("../projection");
var Arena = require("../arena");
var Visualizer = require("../visualizer");
var State = require("../state");
var VesselDetector = require("../vessel-detector.js");
var FreeCounter = require("../free-counter.js");
var SunkShipHandler = require("../tools/shipSunkHandler.js");
var shuffle = require('knuth-shuffle').knuthShuffle;
var Fleet = require('../fleet.js');
var charm = require('charm')();
var Statistic = require("../statistic.js");
var HeatMap = require("../heatmap.js");
var GaussKernel = require("../gauss-kernel.js");
var AdaptivePlacement = require("../adaptive-placement.js");
charm.pipe(process.stdout);
//charm.reset();
module.exports = function() {
  var lastAttackedField;
  var arena = Arena._16x16();
  var visualizer = Visualizer(arena);
  var Field = arena.field;
  var vesselDetector = VesselDetector(arena);
  var freeCounter = FreeCounter(arena);
  var state = State();
  var sunkShipHandler = SunkShipHandler();
  var fleet;
  var statistic = Statistic(arena);
  var heatMap;
  var resetHeatMap = function() {
    //console.log("reset heatmap");
    heatMap = HeatMap(arena);
  };
  var updateHeatMap = function() {
    //console.log("update heatmap");
    var weight = function(fld, i) {
      return 1 / (1 + i);
    };
    heatMap.add(statistic.attackedFields, weight);
    statistic = Statistic(arena);
  };


  var gaussKernel =
  /* [
  [1/16,2/16,1/16],
  [2/16,4/16,2/16],
  [1/16,2/16,1/16],
  ];*/
  GaussKernel(7);

  var placeShips = function(emit) {
    var cost = heatMap.convolve(gaussKernel).normalize();
    //console.log(Visualizer(arena).render(cost));
    var accept = function(ships) {
      var f = Fleet(arena, ships);
      return f.specials()[5] > 3;
    };
    var ships = AdaptivePlacement(arena, cost, accept).placeShips();

    fleet = Fleet(arena, ships.map(function(ship) {
      return ship.asFields();
    }));

    //console.log("placement:",ships.map(function(ship){return ship.asPlacement();}));

    emit(ships);
  };

  var processMessage = function(msg) {
    var f = msg.field ? Field(msg.field) : lastAttackedField;
    if (!f) {
      //console.log("WARNING: no field");
    }
    fleet.message(msg, f);
    statistic.message(msg, f);
    var interprete = {
      30: function(f) {
        state(f).type = "water";
      },
      31: function(f) {
        //console.log("treffer", f.toString());
        state(f).type = "ship";
      },
      32: function(f) {
        state = sunkShipHandler.handleSunkShip(state, f);
      },
      40: function(f) {
        var markWater = function(f) {
          var s = state(f);
          if (typeof s.type === "undefined") {
            s.type = "water";
          }
        };

        [f, f.n(), f.w(), f.s(), f.e()].forEach(markWater);
      }
    }[msg.code];

    //console.log("code",msg.code,"action",interprete);

    if (typeof interprete !== "undefined") {
      interprete(f);
    }
  };


  var N = function(n) {
    var r = [];
    for (var i = 0; i < n; i++) {
      r.push(i);
    }
    return r;
  };


  var byNumberOfFitsAscending = function(a, b) {
    var fits = function(f) {
      var remaining = [5, 5, 4, 4, 3, 3, 2, 2];
      if (state("enemyShips").remaining) {
        remaining = state("enemyShips").remaining;
      }
      return remaining.reduce(function(prev, cur) {
        return prev + state(f).fits(cur);
      }, 0);
    };
    return fits(a) - fits(b);
  };

  var byNumberOfCBFitsAscending = function(a, b) {
    var fits = function(f) {
      var remaining = [5, 5, 4, 4, 3, 3, 2, 2];
      if (state("enemyShips").remaining) {
        remaining = state("enemyShips").remaining;
      }
      var fields = [f, f.n(), f.s(), f.w(), f.e()].filter(function(x) {
        return x;
      });
      return remaining.reduce(function(prev, cur) {
        var sumFits = fields.reduce(function(sum, currentField) {
          return prev + state(currentField).fits(cur);
        }, 0);
        return prev + sumFits;
      }, 0);
    };
    return fits(a) - fits(b);
  };

  var createRandomFields = function() {
    var numbers = N(arena.rows() * arena.columns());
    var fields = numbers.map(function(n) {
      return arena.field(n);
    });
    shuffle(fields);
    fields.sort(byNumberOfFitsAscending);
    return fields;
  };
  var createRandomCBFields = function() {
    var numbers = N(arena.rows() * arena.columns());
    var fields = numbers.map(function(n) {
      return arena.field(n);
    });
    shuffle(fields);
    fields.sort(byNumberOfCBFitsAscending);
    return fields;
  };

  return {
    reset: function() {
      state = State();
    },
    newMatch: resetHeatMap,
    newRound: updateHeatMap,
    name: function() {
      return "tbsa";
    },
    ships: placeShips,
    //  ships:RandomShipPlacement(),
    attack: function(messages, callback) {

      messages.forEach(processMessage);

      state = vesselDetector.scan(state);
      state = freeCounter.scan(state);

      //charm.position(0, 1);
      //console.log(visualizer.render(fleet.visualize, state.visualize));
      //charm.erase("down");
      //console.log("some statistics from your fleet admiral:");
      //console.log(fleet.vessels().map(function(v) {
     //  return v.size + "@" + v.head + ": " + v.missed;
     // }).join("\n"));

      var f;

      var recommendedFields = arena.filter(function(f) {
        return state(f).recommended;
      });
      var randomFields = createRandomFields();

      var randomCBFields = createRandomCBFields();

      // //console.log("randomFields:",randomFields.map(function(f){return f.toString();}).join(", "));

      do {
        f = recommendedFields.pop();
      } while (typeof f !== "undefined" && (state(f).type || state(f).tried));

      if (f) {
        //console.log("attacking recommended field", f.toString());
        callback(f.toString());
      } else {
        if (fleet.specials()[5] > 0) {
          do {
            f = randomCBFields.pop();
          } while (typeof f !== "undefined" && (state(f).type || state(f).tried));
          //console.log("specials", fleet.specials());
          //console.log("clusterombing random field", f.toString());
          callback("+" + f.toString());
        } else {
          do {
            f = randomFields.pop();
          } while (typeof f !== "undefined" && (state(f).type || state(f).tried));
          //console.log("attacking random field", f.toString());
          callback(f.toString());
        }
      }
      state(f).tried = true;
      lastAttackedField = f;
    }
  };
};
