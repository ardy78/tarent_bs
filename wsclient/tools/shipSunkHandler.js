module.exports = function() {

  var WATER = "water";
  var SHIP = "ship";
  var isUnknown = function(state, field) {
    var type = state(field).type;
    return type !== "water" && type !== "ship";
  };
  var setWater = function(state, field, reason) {
    if (state(field).type != "water") {
      state(field).type = "water";
      state(field).reason = reason;
    }
  };

  return {


    handleSunkShip: function(state, anyField) {
      var newState = state.clone();

      // first we mark the hit field as ship
      newState(anyField).type = "ship";


      // now, count the hits to each direction, to know which ship is sunk. 
      var countToDir = {};

      var dirs = ["n", "s", "e", "w"];

      dirs.forEach(function(dir) {
        countToDir[dir] = 0;
        var currentField = anyField;
        while (true) {
          currentField = currentField[dir]();
          if (currentField === undefined) {
            // moved out of playing field
            break;
          }
          if (newState(currentField).type !== "ship") {
            //if (isUnknown(newState, currentField)) {
            setWater(newState, currentField, "4");
            //console.log("[HandleSunkShip] Field " + currentField.toString() + " is marked as water next to sunk ship!");
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


      // destroy it!!!!
      var ships = newState("enemyShips").remaining;
      if(typeof ships === "undefined"){
        ships=newState("enemyShips").remaining=[5,5,4,4,3,3,2,2];
      }
      if (fS > 0 || fN > 0) {
        //console.log("[HandleSunkShip] Sunk ship is vertical. There are " + fN + " hits to North and " + fS + " hits to South from " + anyField.toString());
        var length = 1 + fS + fN;
        ships.splice(ships.indexOf(length), 1); // removes the first occurence of 'length' in the ships array
      } else if (fE > 0 || fW > 0) {
        //console.log("[HandleSunkShip] Sunk ship is horizontal. There are " + fW + " hits to West and " + fE + " hits to East from " + anyField.toString());
        var length = 1 + fW + fE;
        ships.splice(ships.indexOf(length), 1); // removes the first occurence of 'length' in the ships array
      }
      //console.log("[HandleSunkShip] Remaining Ships:", ships);

      newState("enemyShips").remaining = ships;

      return newState;
    }
  };
};
