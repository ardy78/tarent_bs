module.exports = function() {
  var mockShip = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };
  var attacksCounter = 0;

  // playing field is an array from 00 to 99
  var playingField = [];
  var possibilities = [];

  for (var i = 0; i < 100; i++) {
    playingField[i] = {
      type: "unknown"
    };
  }

  var isWater = function(field) {
    return playingField[field].type == "water";
  };

  var ships = [
    2, 2, 3, 3, 4, 4, 5, 5
  ];

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
          if (!isWater(field + toRight)) {
            spaceToRight++;
          } else {
            break;
          }
        }
        // increase value for every ship that is long enough to reach this field  
        ships.forEach(function(shipLength) {
          if (shipLength > spaceToRight) {
            return;
          }
          var hitBonus = 0;
          for (var l = 0; l < shipLength; l++) {
            var fieldNr = field + l;
            if (playingField[fieldNr].type == "hit") {
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
          if (!isWater(field + toSouth * 10)) {
            spaceToSouth++;
          } else {
            break;
          }
        }
        // increase value for every ship that is long enough to reach this field  
        ships.forEach(function(shipLength) {
          if (shipLength > spaceToSouth) {
            return;
          }
          //console.log("increased p at field", (field+toRight), "from", possibilities[field+toRight]);
          var hitBonus = 0;
          for (var l = 0; l < shipLength; l++) {
            var fieldNr = field + l * 10;
            if (playingField[fieldNr].type == "hit") {
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
      if (playingField[f].type != "unknown") {
        possibilities[f] = 0;
      }
    }
  };

  var convertField = function(field) {
    return field;
  };

  var lastAttackedField;

  var markSurroundingWater = function(field) {
    var leftTop = field - 11;
    if (field % 10 != 0 && leftTop >= 0) {
      playingField[leftTop].type = "water";
    }
    var rightTop = field - 9;
    if (field % 10 != 9 && rightTop >= 0) {
      playingField[rightTop].type = "water";
    }
    var leftBottom = field + 9;
    if (field % 10 != 0 && leftBottom < 100) {
      playingField[leftBottom].type = "water";
    }
    var rightBottom = field + 11;
    if (field % 10 != 9 && leftBottom < 100) {
      playingField[rightBottom].type = "water";
    }
  };
  var handleSunkShip = function(field) {
    // fields to the directions:
    var fN, fS, fE, fW;

    // North
    for(var i = 1; i < 5; i++) {
      var f = field - 
    }


  };

  var handleMessages = function(messages) {
    messages.forEach(function(msg) {
      msg.field = lastAttackedField;
      var field = convertField(msg.field);
      if (msg.code == 30) {
        playingField[field].type = "water";
      } else if (msg.code == 31) {
        playingField[field].type = "hit";
        //console.log(playingField);
        markSurroundingWater(field);
      } else if (msg.code == 32) {
        playingField[field].type = "hit";
        markSurroundingWater(field);
        handleSunkShip(field);
        console.log("Ship sunk!");
      }
    });
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
  var printPlayingField = function() {
    var letter, type;
    console.log("  0 1 2 3 4 5 6 7 8 9");
    console.log("");
    for (var i = 0; i < 10; i++) {
      var row = [];
      row.push("ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 10; j++) {
        type = playingField[i * 10 + j].type;
        if (type == "water") {
          letter = "O ";
        } else if (type == "hit") {
          letter = "X ";
        } else {
          letter = "- ";
        }
        row.push(letter);
      }
      console.log(row.join(""));
    }
  }

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
      handleMessages(messages);
      printPlayingField();
      var field = findFieldToAttack();
      lastAttackedField = field;
      var fieldAsText = "ABCDEFGHIJ" [Math.floor(field / 10)] + (field % 10).toString();
      console.log("attack #" + attacksCounter++, "Field:", fieldAsText, "(" + field + ")");
      callback(fieldAsText);
    }
  };
};
