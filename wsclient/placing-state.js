var obj = require("./utils").object;
var defaultState = require("./default-state");

module.exports = function(emit, actions, states) {
  var ships;

  var placeShip = function() {
    emit(ships.shift().asPlacement());
  };


  return obj(defaultState(states), {
    name: "placing",
    enter: function() {
      actions.ships(function(theShips) {
        ships = theShips;
        placeShip();
      });
    },
    11: function() {
      placeShip();
    },
    13: function(){
      return states.playing;
    },
    //workaround für bug im server!!
    29: function() {
      actions.attack([],function(attackCmd) {
        emit(attackCmd);
      });
      return states.playing;
    }
  });
};