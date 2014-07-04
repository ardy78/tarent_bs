var Arena = require('../arena');
var State = require('../state');
var shipSunkHandler = require("../tools/shipSunkHandler")();

var VesselDetector = require("../vessel-detector");

var Visualizer = require("../visualizer");

var Fleet = require('../fleet.js');
module.exports = function() {


  var W_MISS = 0;
  var W_CALC_OTHER = 2;
  var W_CORNER = 3;
  var W_SUNK = 4;
  var W_NO_POSSIBILITY = '=';
  
  var fleet;
  var clusterbombed = false;

  var sunkShips = [];

  // replace playingField by arena
  var arena = Arena._16x16();
  var state = State();

  var vesselDetector = VesselDetector(arena);

  var visualizer = Visualizer(arena);

  for (var i = 0; i < 16 * 16; i++) {
    state(i).type = "unknown";
  }

  var isWater = function(field) {
    return state(field).type == "water";
  };

  var isUnknown = function(field) {
    /*if(typeof state(field).type === "undefined") {
      return true; 
    }
    return false;*/
    var type = state(field).type;
    return type !== "water" && type !== "ship";
  };


  var getShip = function(state, anyField) {

    var dirs = ["n", "s", "e", "w"];

    var fields = [anyField];

    dirs.forEach(function(dir) {
      var currentField = anyField;
      while (true) {
        currentField = currentField[dir]();
        if (currentField === undefined) {
          // moved out of playing field
          break;
        }
        if (state(currentField).type !== "ship") {
          break;
        }

        fields.push(currentField);
      }

    });
    fields.sort(function(f1, f2) {
      return f1.num() > f2.num();
    });
    return fields;
  };

  var ships = [
    2, 2, 3, 3, 4, 4, 5, 5
  ];

  var lastAttackedField;

  var setWater = function(field, reason) {
    if (state(field).type != "water") {
      state(field).type = "water";
      state(field).reason = reason;
    }
  };

  var markSurroundingWater = function(field) {
    //var f = playingField(field);

    var f = field;

    var fields = [
      f.ne(), f.nw(), f.sw(), f.se()
    ];

    fields.forEach(function(cf) {
      if (cf !== undefined) {
        setWater(cf, W_CORNER);
      }
    });
  };
  var handleSunkShip = function(field) {
    state = shipSunkHandler.handleSunkShip(state, field);

  };

  var recommendShips = function() {
    var vesselState = vesselDetector.scan(state);
    console.log(visualizer.render(vesselState.visualize));
    return vesselState;
  };

  var handleMessages = function(messages) {
    messages.forEach(function(msg) {
      var field = msg.field ? arena.field(msg.field) : lastAttackedField;
     
      fleet.message(msg, field);
      debugger;
      if (msg.code == 30) {
        if (field) { //BUGFIX on roundchange
          if (!isUnknown(field)) {
            console.log("WTF????? YOU SHOT ON A KNOWN FIELD!!!");
          }
          console.log("[stateKeeper] registered miss on ", field.toString());
          setWater(field, W_MISS);
        }
      } else if (msg.code == 31) {
        state(field).type = "ship";
        //console.log(playingField);
        markSurroundingWater(field);
      } else if (msg.code == 32) {
        state(field).type = "ship";
        markSurroundingWater(field);
        handleSunkShip(field);
        console.log("Ship sunk!");
        sunkShips.push(getShip(state, field));
//        console.log("sunk ships: ", sunkShips);
      } else if (msg.code == 40) {
        console.log("handeling clusterbomb message, field:", field.toString());
        var markWater = function(f) {
          console.log("[markWater]", f.toString());
          var s = state(f);
          if (typeof s.type === "undefined" || s.type == "unknown") {
            s.type = "water";
            console.log("mark field " + f.toString() + " as water (clusterbomb)");
          } else {
            console.log(s.type);
          }
        };

        [field, field.n(), field.w(), field.s(), field.e()].forEach(markWater);

      } else if (msg.code == 44) {
        console.log("I got clusterbombed");
        clusterbombed = true;
      }
    });
  };




  var printPlayingField = function() {
    console.log(visualizer.render(state.visualize));
    return;

    var letter, type;
    console.log("  0 1 2 3 4 5 6 7 8 9 A B C D E F");
    console.log("");
    for (var i = 0; i < 16; i++) {
      var row = [];
      row.push("0123456789ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 16; j++) {

        var field = arena.field(j, i);
        type = state(field).type;
        if (type === "water") {
          var reason = state(field).reason.toString();
          letter = reason + " ";
        } else if (type === "ship") {
          letter = "X ";
        } else {
          letter = "- ";
        }
        row.push(letter);
      }
      console.log(row.join(""));
    }
  };


  return {
    printField: printPlayingField,
    recommendShips: recommendShips,
    handleMessages: handleMessages,
    attacking: function(field) {
      lastAttackedField = field;
    },
    isWater: isWater,
    isHit: function(field) {
      return state(field).type == "ship";
    },
    isShip: function(field) {
      return state(field).type == "ship";
    },
    isUnknown: isUnknown,
    remainingShips: function() {
      return ships;
    },
    setWater: setWater,
    arena: arena,
    state: state,
    getFleet: function() {
      return fleet;
    },
    setFleet: function(fl) {
      fleet = fl;
    },
    sunkShips: sunkShips,
    getState: function() {
      return state;
    },
    gotClusterbombed: function () {
      return clusterbombed;
    } 
  };
}
