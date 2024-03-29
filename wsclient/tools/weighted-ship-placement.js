var Arena = require('../arena');
var State = require('../state');
var StateHelper = require('./stateHelper');
var Visualizer = require('../visualizer');

module.exports = function(arena, weight) {
  var ANY = 0;
  var WATER = 1;
  var SHIP = "occ";
  if (typeof arena === "undefined") {
    arena = Arena._16x16();
  }

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
  var getRandomField = arena.weightedRandom(weight);
  var getRandomBoolean = function() {
    return Math.random() >= 0.5;
  };

  var createShip = function(fld, dir, length) {
    var flds = [];
    while (flds.length < length && fld) {
      flds.push(fld);
      fld = fld[dir]();
    }
    if(flds.length != length){
      return undefined;
    }
    return flds;
  };
  var sumWeight = function(flds){
    return flds.map(weight).reduce(function(a, b) {
      return a + b;
    });
  };

  var placeShips = function(maxTries) {
    var state = State();
    var stateHelper = StateHelper(state);
    var visualizer = Visualizer(arena);


    // place Ships
    var ships = [2, 2, 3, 3, 4, 4, 5, 5];

    //  //console.log("Placing the following ships:", ships);

    var placedShips = [];
    // begin with largest ship:
    ships.reverse().forEach(function(ship) {
      var length = ship;
      //    //console.log("Placing ship:", length);
      var nextTry = function() {
        var startField = getRandomField();
        var dir;
        if (getRandomBoolean()) {
          dir = "e";
        } else {
          dir = "s";
        }

        var fields = stateHelper.checkIfPlacementPossible(startField, dir, length);

        if (!fields) {
          return false;
        }

        stateHelper.placeShipsAndMarkWater(fields);

        placedShips.push(Ship(fields));

        //      //console.log(visualizer.render(state.visualize));

        return true;
      };
      var tries = 0;
      //console.log("start with tries="+tries);
      while (!nextTry()) {
        tries++;
        if (tries > maxTries) {
          throw new Error("to many tries:" + tries);
        }
      }
    });
    return placedShips;
  };



  return function(emit) {
    var placed = false;
    //console.log("START: Random ship placement....");
    while (!placed) {
      //    try {
      var ships = placeShips(100);
      emit(ships);
      placed = true;
      //    } catch (e) {
      //      //console.log("Placing ships failed after 100 iterations.. restarting..", e);
      //    }
    }
    //console.log("END: Random ship placement finished.");
  };
}
