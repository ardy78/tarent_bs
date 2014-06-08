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

  for (var i = 0; i < 100; i++) {
    playingField[i] = {
      type: "unknown"
    };
  }

  var convertField_unused = function(field) {
    var text = field.replace("A", "0").replace("B", "1").replace("C", "2")
      .replace("D", "3").replace("E", "4").replace("F", "5")
      .replace("G", "6").replace("H", "7").replace("I", "8")
      .replace("J", "9");
    return parseInt(text);
  };
  var convertField = function(field) {
    return field;
  };

  var lastAttackedField;

  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "tarent bullship";
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
      messages.forEach(function(msg) {
        msg.field= lastAttackedField;
        if (msg.field) {
          var field = convertField(msg.field);
          if (msg.code == 30) {
            playingField[field].type = "water";
          } else if (msg.code == 31) {
            playingField[field].type = "hit";
            console.log(playingField);
          }
        } else {
          console.log(msg);
        }
      });
      console.log("attack #" + attacksCounter++);
      var col;
      var row;
      do {
        col = Math.floor(Math.random() * 10);
        row = Math.floor(Math.random() * 10);
        lastAttackedField = col*10 + row;
      } while(playingField[lastAttackedField].type != "unknown");
      callback("ABCDEFGHIJ" [col] + row);
    }
  };
};
