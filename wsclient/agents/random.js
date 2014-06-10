var StateKeeper = require("./stateKeeper");
var RandomShipPlacement = require("../tools/randomShipPlacement");
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
    ships: RandomShipPlacement(),
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
