module.exports = function() {
  // playing field is an array from 00 to 99
  var playingField = [];


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
    var fN = 0,
      fS = 0,
      fE = 0,
      fW = 0;

    // North
    for (var i = 1; i < 5; i++) {
      var f = field - i * 10;
      if (f < 0) {
        break;
      }
      if (playingField[f].type == "hit") {
        fN = i;
      } else {
        if (playingField[f].type == "unknown") {
          playingField[f].type = "water";
          console.log("Field " + f + " is marked as water next to sunk ship!");
        }
        break;
      }

    }

    // South
    for (var i = 1; i < 5; i++) {
      var f = field + i * 10;
      if (f > 99) {
        break;
      }
      if (playingField[f].type == "hit") {
        fS = i;
      } else {
        if (playingField[f].type == "unknown") {
          playingField[f].type = "water";
          console.log("Field " + f + " is marked as water next to sunk ship!");
        }
        break;
      }

    }

    // West
    for (var i = 1; i < 5; i++) {
      var f = field - i;
      if (f < 0 || f % 10 == 9) {
        break;
      }
      if (playingField[f].type == "hit") {
        fW = i;
      } else {
        if (playingField[f].type == "unknown") {
          playingField[f].type = "water";
          console.log("Field " + f + " is marked as water next to sunk ship!");
        }
        break;
      }

    }

    // East
    for (var i = 1; i < 5; i++) {
      var f = field + i;
      if (f % 10 == 0) {
        break;
      }
      if (playingField[f].type == "hit") {
        fE = i;
      } else {
        if (playingField[f].type == "unknown") {
          playingField[f].type = "water";
          console.log("Field " + f + " is marked as water next to sunk ship!");
        }
        break;
      }
    }
    if (fS > 0 || fN > 0) {
      console.log("Sunk ship is vertical. There are " + fN + " hits to North and " + fS + " hits to South from " + field);
      var length = 1 + fS + fN;
      ships.splice(ships.indexOf(length), 1); // removes the first occurence of 'length' in the ships array
    } else if (fE > 0 || fW > 0) {
      console.log("Sunk ship is horizontal. There are " + fW + " hits to West and " + fE + " hits to East from " + field);
      var length = 1 + fW + fE;
      ships.splice(ships.indexOf(length), 1); // removes the first occurence of 'length' in the ships array
    }
    console.log("Remaining Ships:", ships);


  };

  var handleMessages = function(messages) {
    messages.forEach(function(msg) {
      msg.field = lastAttackedField;
      var field = msg.field;
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
  };


  return {
    printField: printPlayingField,
    handleMessages:handleMessages,
    attacking: function(field) {
      lastAttackedField = field;
    },
    isWater: isWater,
    isHit: function(field) {
        return playingField[field].type == "hit";
    },
    isUnknown: function(field) {
      return playingField[field].type == "unknown";
    },
    remainingShips: function() {
      return ships; 
    }
  };
}
