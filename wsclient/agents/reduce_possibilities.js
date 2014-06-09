var StateKeeper = require("./stateKeeper");

module.exports = function() {
  var mockShip = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };
  var stateKeeper = StateKeeper();
  var attacksCounter = 0;

  var possibilities = [];
  var resetPossibilities = function() {
    for (var f = 0; f < 100; f++) {
      possibilities[f] = 0;
    }
  };
  var calculate_possibilities = function() {
    resetPossibilities();
    var longestShip = 5;
    for (var i = 0; i < 10; i++) { // rows
      for (var j = 0; j < 10; j++) { // cols
        var field = i * 10 + j;
        var spaceToRight = 0;
        for (var toRight = 0; toRight < longestShip; toRight++) {
          if (toRight + j > 9) {
            break;
          }
          if (!stateKeeper.isWater(field + toRight)) {
            spaceToRight++;
          } else {
            break;
          }
        }
        // increase value for every ship that is long enough to reach this field  
        stateKeeper.remainingShips().forEach(function(shipLength) {
          if (shipLength > spaceToRight) {
            return;
          }
          var hitBonus = 0;
          for (var l = 0; l < shipLength; l++) {
            var fieldNr = field + l;
            if (stateKeeper.isHit(fieldNr)) {
              hitBonus += 25;
            }
          }
          //console.log("increased p at field", (field+toRight), "from", possibilities[field+toRight]);
          for (var l = 0; l < shipLength; l++) {
            possibilities[field + l] += (hitBonus + 1);
          }
        });
        var spaceToSouth = 0;
        for (var toSouth = 0; toSouth < longestShip; toSouth++) {
          if (toSouth + i > 9) {
            break;
          }
          if (!stateKeeper.isWater(field + toSouth * 10)) {
            spaceToSouth++;
          } else {
            break;
          }
        }
        // increase value for every ship that is long enough to reach this field  
        stateKeeper.remainingShips().forEach(function(shipLength) {
          if (shipLength > spaceToSouth) {
            return;
          }
          //console.log("increased p at field", (field+toRight), "from", possibilities[field+toRight]);
          var hitBonus = 0;
          for (var l = 0; l < shipLength; l++) {
            var fieldNr = field + l * 10;
            if (stateKeeper.isHit(fieldNr)) {
              hitBonus += 25;
            }
          }

          // increase...
          for (var l = 0; l < shipLength; l++) {
            possibilities[field + l * 10] += (hitBonus + 1);
          }
        });
      }
    }
    //never shoot at know fields!
    for (var f = 0; f < 100; f++) {
      if (!stateKeeper.isUnknown(f)) {
        possibilities[f] = 0;
      }
    }
  };


  var printPossibilities = function() {
    var val, p;
    console.log("    0   1   2   3   4   5   6   7   8   9");
    console.log("");
    for (var i = 0; i < 10; i++) {
      var row = [];
      row.push("ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 10; j++) {
        p = possibilities[i * 10 + j];
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

  var findFieldToAttack = function() {
    calculate_possibilities();
    printPossibilities();
    var highestValue = 0;
    var highestPosition;
    for (var f = 0; f < 100; f++) {
      if (possibilities[f] > highestValue) {
        highestValue = possibilities[f];
        highestPosition = f;
      }
    }
    return highestPosition;
  };
  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "reduce_possibilities";
    },
    ships: function(emit) {
      emit([
        mockShip("a1,a2,a3,a4,a5"),
        mockShip("g1,g2,g3,g4,g5"),
        mockShip("c1,c2,c3,c4"),
        mockShip("c6,c7,c8,c9"),
        mockShip("i1,i2,i3"),
        mockShip("e1,e2,e3"),
        mockShip("f7,f8"),
        mockShip("i8,i9")
      ]);
    },
    attack: function(messages, callback) {
      stateKeeper.handleMessages(messages);
      stateKeeper.printField();
      var field = findFieldToAttack();
      stateKeeper.attacking(field);
      var fieldAsText = "ABCDEFGHIJ" [Math.floor(field / 10)] + (field % 10).toString();
      console.log("attack #" + attacksCounter++, "Field:", fieldAsText, "(" + field + ")");
      callback(fieldAsText);
    }
  };
};
