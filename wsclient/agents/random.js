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
    var field;
    do {
      field = stateKeeper.arena.randomField();
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
      console.log("attack #" + attacksCounter++, "Field:", field.toString());
      callback(field.toString());
    }
  };
};
