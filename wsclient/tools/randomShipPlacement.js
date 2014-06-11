module.exports = function() {
  var ANY = 0;
  var WATER = 1;
  var SHIP = 2;

  var numberFieldAsString = function(field) {
    return "ABCDEFGHIJ" [Math.floor(field / 10)] + field % 10;
  };

  var Ship = function(topLeft, bottomRight) {
    return {
      asFields: function() {

        var fields = [];
        //horizontal ships:
        if (Math.floor(topLeft / 10) == Math.floor(bottomRight / 10)) {
          for (var i = topLeft; i <= bottomRight; i++) {
            fields.push(i);
          }
        } else {
           for (var i = topLeft; i <= bottomRight; i+=10) {
            fields.push(i);
          }
        }
        return fields;
      },
      asPlacement: function() {
        var fields = [];
        this.asFields().forEach(function(field) {
            fields.push(numberFieldAsString(field));
        });
        var res = fields.join(",");
        console.log("placed ship", res);
        return res;
      },
      topLeft: topLeft,
      bottomRight: bottomRight
    };
  };
  var getRandomField = function() {
    return Math.floor(Math.random() * 100);
  };
  var getRandomBoolean = function() {
    return Math.random() >= 0.5;
  };
  var placeShips = function(maxTries) {
    // init playing Field
    var playingField = [];
    for (var i = 0; i < 100; i++) {
      playingField[i] = ANY;
    }

    var tries = 0;

    // place Ships
    var ships = [2, 2, 3, 3, 4, 4, 5, 5];

    console.log("Placing the following ships:", ships);

    var placedShips = [];
    // begin with largest ship:
    ships.reverse().forEach(function(ship) {
      var length = ship;
      console.log("Placing ship:", length);
      var nextTry = function() {
        var field = getRandomField();
        if (getRandomBoolean()) {
          // horizontal ship
          var rightEndPos = field % 10 + length - 1;
          if (rightEndPos > 9) {
            return false;
          }

          var rightField = field + length - 1;
          for (var i = field; i <= rightField; i++) {
            if (playingField[i] != ANY) {
              return false;
            }
          }
          // successful -> place
          for (var i = field; i <= rightField; i++) {
            playingField[i] = SHIP;
          }
          placedShips.push(Ship(field, rightField));
          // surround with water:
          // north
          if (field >= 10) {
            for (var i = field - 11; i <= (rightField - 9); i++) {
              playingField[i] = WATER;
            }
          }
          // south
          if (field < 90) {
            for (var i = field + 9; i <= (rightField + 11); i++) {
              playingField[i] = WATER;
            }
          }
          // west
          if (field % 10 != 0) {
            playingField[field - 1] = WATER;
          }
          if (field % 10 != 9) {
            playingField[rightField + 1] = WATER;
          }
          return true;
        } else {
          // vertical ship

          var bottomField = field + (length - 1) * 10;
          if (bottomField > 99) {
            return false;
          }

          for (var i = field; i <= bottomField; i += 10) {
            if (playingField[i] != ANY) {
              return false;
            }
          }
          // successful -> place
          for (var i = field; i <= bottomField; i += 10) {
            playingField[i] = SHIP;
          }
          placedShips.push(Ship(field, bottomField));
          // surround with water:
          // west
          if (field % 10 > 0) {
            for (var i = field - 11; i <= (bottomField + 9); i += 10) {
              if (i >= 0 && i < 100) {
                playingField[i] = WATER;
              }
            }
          }
          // east
          if (field % 10 < 9) {
            for (var i = field - 9; i <= (bottomField + 11); i += 10) {
              if (0 <= i && i <= 99) {
                playingField[i] = WATER;
              }
            }
          }
          // north
          if (field >= 10) {
            playingField[field - 10] = WATER;
          }
          // south
          if (field < 90) {
            playingField[bottomField + 10] = WATER;
          }
          return true;
        }
      }
      while (!nextTry()) {
        tries++;
        if (tries > maxTries) {
          throw "to many tries";
        }
      };
    });
    return placedShips;
  };



  return function(emit) {
    var placed = false;
    console.log("START: Random ship placement....");
    while (!placed) {
      try {
        var ships = placeShips(100);
        emit(ships);
        placed = true;
      } catch (e) {
        console.log("Placing ships failed after 100 iterations.. restarting..", e);
      }
    }
    console.log("END: Random ship placement finished.");
  };
}
