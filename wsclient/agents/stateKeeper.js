var Arena = require('../arena');

module.exports = function() {


  var W_MISS = 0;
  var W_CALC_OTHER = 2;
  var W_CORNER = 3;
  var W_SUNK = 4;
  var W_NO_POSSIBILITY = '=';


  // replace playingField by arena
  var arena = Arena._16x16();
  var playingField = arena.field;

  for (var i = 0; i < 16 * 16; i++) {
    playingField(i).type = "unknown";
  }

  var isWater = function(field) {
    return playingField(field).type == "water";
  };

  var isUnknown = function(field) {
    return playingField(field).type == "unknown";
  };



  var ships = [
    2, 2, 3, 3, 4, 4, 5, 5
  ];

  var lastAttackedField;

  var setWater = function(field, reason) {
    if (playingField(field).type != "water") {
      playingField(field).type = "water";
      playingField(field).reason = reason;
    }
  };

  var markSurroundingWater = function(field) {
    var f = playingField(field);

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

    var countToDir = {};

    var dirs = ["n", "s", "e", "w"];

    dirs.forEach(function(dir) {
      countToDir[dir] = 0;
      var currentField = playingField(field);
      while (true) {
        currentField = currentField[dir]();
        if (currentField === undefined) {
          // moved out of playing field
          break;
        }

        if (isUnknown(currentField)) {
          setWater(currentField, W_SUNK);
          console.log("Field " + f + " is marked as water next to sunk ship!");
          break;
        }

        // hit
        countToDir[dir]++;
      }

    });
    // fields to the directions:
    var fN = countToDir.n,
      fS = countToDir.s,
      fE = countToDir.e,
      fW = countToDir.w;

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
        playingField(field).type = "water";
        playingField(field).reason = W_MISS;
      } else if (msg.code == 31) {
        playingField(field).type = "hit";
        //console.log(playingField);
        markSurroundingWater(field);
      } else if (msg.code == 32) {
        playingField(field).type = "hit";
        markSurroundingWater(field);
        handleSunkShip(field);
        console.log("Ship sunk!");
      }
    });
  };




  var printPlayingField = function() {
    var letter, type;
    console.log("  0 1 2 3 4 5 6 7 8 9 A B C D E F");
    console.log("");
    for (var i = 0; i < 16; i++) {
      var row = [];
      row.push("0123456789ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 16; j++) {
        type = playingField(i,j).type;
        if (type == "water") {
          var reason = playingField(i,j).reason.toString();
          letter = reason + " ";
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
    handleMessages: handleMessages,
    attacking: function(field) {
      lastAttackedField = field;
    },
    isWater: isWater,
    isHit: function(field) {
      return playingField(field).type == "hit";
    },
    isUnknown: isUnknown,
    remainingShips: function() {
      return ships;
    },
    setWater: setWater,
    arena: arena
  };
}
