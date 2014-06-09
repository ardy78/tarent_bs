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

  var markSurroundingWater = function(field) {
    var leftTop = field - 11;
    if(field % 10 != 0 && leftTop >= 0) {
      playingField[leftTop].type= "water";
    }
    var rightTop = field - 9;
    if(field % 10 != 9 && rightTop >= 0) {
      playingField[rightTop].type = "water";
    }
    var leftBottom = field + 9;
    if(field % 10 != 0 && leftBottom < 100) {
      playingField[leftBottom].type = "water";
    }
    var rightBottom = field + 11;
    if(field % 10 != 9 && leftBottom < 100) {
      playingField[rightBottom].type = "water";
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
        console.log("Ship sunk!");
      }
    });
  };
  var findFieldToAttack = function() {
    var col;
    var row;
    var field;
    do {
      col = Math.floor(Math.random() * 10);
      row = Math.floor(Math.random() * 10);
      field = col * 10 + row;
    } while (playingField[field].type != "unknown");
    return field;
  };
  var printPlayingField = function() {
    var letter, type;
    console.log("  0123456789");
    console.log("");
    for (var i = 0; i < 10; i++) {
      var row = [];
      row.push("ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 10; j++) {
        type = playingField[i * 10 + j].type;
        if (type == "water") {
          letter = "O";
        } else if (type == "hit") {
          letter = "X";
        } else {
          letter = " ";
        }
        row.push(letter);
      }
      console.log(row.join(""));
    }
  }

  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "stateKeeper";
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
