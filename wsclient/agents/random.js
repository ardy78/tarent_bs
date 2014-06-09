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

  var findFieldToAttack = function() {
    var col;
    var row;
    var field;
    do {
      col = Math.floor(Math.random() * 10);
      row = Math.floor(Math.random() * 10);
      field = col * 10 + row;
    } while (!stateKeeper.isUnknown(field));
    return field;
  };
  
  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "stateKeeper - random shooter";
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
