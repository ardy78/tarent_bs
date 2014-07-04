var StateKeeper = require("./stateKeeper");
var RandomShipPlacement = require("../tools/mattisShipPlacement");
var Arena = require("../arena");



var PositionBook = require("../position-book");


var Fleet = require('../fleet.js');

var RANDOM = true;

var CLUSTERBOMB_BONUS = 50;

module.exports = function() {
  var stateKeeper = StateKeeper();
  var arena = Arena._16x16();
  var posBook = new PositionBook();

  var attacksCounter = 0;


  var decorateShips = function(delegatee) {
    var commit;
    var decorateEmit = function(emit) {
      return function(ships) {
        stateKeeper.setFleet(Fleet(arena, ships.map(function(ship) {
          return ship.asFields();
        })));
        console.log("fleet placement results in specials:", JSON.stringify(stateKeeper.getFleet().specials(), null, "  "));
        commit = function() {
          emit(ships);
        };
      };
    };
    return function(emit) {
      do {
        delegatee(decorateEmit(emit));
      } while (stateKeeper.getFleet().specials()[5] < 5);
      commit();
    };
  };


  var possibilities = [];
  var resetPossibilities = function() {
    for (var f = 0; f < 16 * 16; f++) {
      possibilities[f] = 0;
    }
  };
  var calculate_possibilities = function() {

    for (var i = 0; i < 16 * 16; i++) {
      var field = stateKeeper.arena.field(i);

      if (stateKeeper.isWater(field)) {
        posBook.registerMiss(field.col(), field.row());
      } else if (stateKeeper.isShip(field)) {
        //TODO
      }
    }

    for (var x = 0; x < 16; x++) {
      for (var y = 0; y < 16; y++) {
        possibilities[16 * y + x] = posBook.getSample(x, y, false);
      }
    }

    printPossibilities();
    // bonus against clusterbombing ships, if there's exactly one 5er remaining ;)

    var cruisers = 0;
    stateKeeper.sunkShips.forEach(function(ship) {
      if (ship.length == 5) {
        cruisers++;
      }
    });

    if (cruisers == 1) {
      if (!stateKeeper.gotClusterbombed) {
        console.log("NOT APPLYING Clusterbombing Bonus, because enemy doesn't use it");
      } else {
        stateKeeper.sunkShips.forEach(function(ship) {
          if (ship.length = 5) {
            console.log("applying clusterbombing bonus!");
            var dirs;
            if (ship[0].s() === ship[1]) {
              dirs = ["w", "e"];
            } else {
              dirs = ["s", "n"];
            }
            ship.forEach(function(field) {
              dirs.forEach(function(dir) {
                var next = field;
                while (typeof next !== "undefined") {
                  possibilities[next.num()] += CLUSTERBOMB_BONUS;
                  next = next[dir]();
                }
              });
            });
          }
        });
      }
    }
    printPossibilities();

    // mark fields with no possible ship as water
    for (var f = 0; f < 16 * 16; f++) {
      if (possibilities[f] === 0 && stateKeeper.isUnknown(f)) {
        var field = stateKeeper.arena.field(f);
        stateKeeper.setWater(field, '=');
      }
    }
    //never shoot at know fields!
    for (var f = 0; f < 16 * 16; f++) {
      var field = arena.field(f);
      if (!stateKeeper.isUnknown(field)) {
        possibilities[f] = 0;
      }
    }

  };


  var printPossibilities = function() {
    var val, p;
    console.log("    0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F");
    console.log("");
    for (var i = 0; i < 16; i++) {
      var row = [];
      row.push("0123456789ABCDEF" [i]);
      row.push(" ");
      for (var j = 0; j < 16; j++) {
        p = possibilities[i * 16 + j];
        if (p < 10) {
          val = "   " + p;
        } else if (p < 100) {
          val = "  " + p;
        } else {
          val = " " + p.toString();
        }
        row.push(val);
      }
      console.log(row.join(""));
    }
  };

  var finishShips = function() {
    var recState = stateKeeper.recommendShips();
    var candidates = arena.filter(function(field) {
      return recState(field).recommended && stateKeeper.isUnknown(field);
    });
    return candidates;
  };

  var randomField = function(fields) {
    if (RANDOM) {
      var index = Math.floor(Math.random() * fields.length);
      console.log("[RANDOM] selected field " + (index + 1) + " of " + fields.length, fields[index].toString());
      return fields[index];
    } else {
      return fields[0];
    }
  }

  var findFieldToAttack = function(clusterbomb) {

    calculate_possibilities();
    printPossibilities();
    var highestValue = -1;
    var highestPositions;
    for (var f = 0; f < 16 * 16; f++) {
      var value;
      if (!clusterbomb) {
        value = possibilities[f];
      } else {
        if (f < 16 || f >= 15 * 16 || f % 16 === 0 || f % 16 === 15) {
          value = 0;
        } else {
          value = possibilities[f] + possibilities[f - 1] + possibilities[f + 1] + possibilities[f - 16] + possibilities[f + 16];
        }
      }
      if (value > highestValue) {
        highestValue = value;
        highestPositions = [f];
      } else if (value === highestValue) {
        highestPositions.push(f);
      }
    }
    var fields = [];
    highestPositions.forEach(function(p) {
      fields.push(stateKeeper.arena.field(p));
    });
    //    console.log("[RANDOM] Possible fields: ", fields);
    return randomField(fields);
  };
  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "d0";
    },
    ships: decorateShips(RandomShipPlacement()),
    attack: function(messages, callback) {
      stateKeeper.handleMessages(messages);
      stateKeeper.printField();
      var field;
      var clusterbomb;

      var finishFields = finishShips();
      if (finishFields.length > 0) {
        calculate_possibilities();
        printPossibilities();
        var highestValue = -1;
        var highestFields = [];
        finishFields.forEach(function(f) {
          var val = possibilities[f.num()];
          if(val > highestValue) {
            highestValue = val;
            highestFields = [f];
          } else if(val === highestValue) {
            highestFields.push(f);
          }
        });
        field = randomField(highestFields);
        
        clusterbomb = false;
      } else {
        clusterbomb = stateKeeper.getFleet().specials()[5] > 0;
        field = findFieldToAttack(clusterbomb);
      }
      stateKeeper.attacking(field);
      console.log("attack #" + attacksCounter++, "Field:", field.toString());

      if (clusterbomb) {
        console.log("THIS IS A CLUSTERBOMB!!!");
        callback("+" + field.toString());
      } else {
        callback(field.toString());
      }
    },
    reset: function() {
      stateKeeper = StateKeeper();
      posBook = new PositionBook();
      attacksCounter = 0;
    }
  };
};
