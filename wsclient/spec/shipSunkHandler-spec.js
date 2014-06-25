var ShipSunkHandler = require("../tools/shipSunkHandler");
var State = require('../state');
var Arena = require('../arena');

describe("The ShipSunkHandler", function() {
  var state;
  var handler;
  var arena = Arena._16x16();
  beforeEach(function() {
    state = State();
    handler = ShipSunkHandler();
  });
  it("handles the case when a ship is sunk based on a single field. It removes the sunk ship from the remaining ships", function() {
    var anyField = arena.field(0x11);

    state(anyField.e()).type = "ship";
    state("enemyShips").remaining = [2,3,3,4,2];

    var newState = handler.handleSunkShip(state, anyField);

    expect(newState(anyField).type).toEqual("ship");
    expect(newState(anyField.e()).type).toEqual("ship");
    expect(newState("enemyShips").remaining).toEqual([3,3,4,2]);
  });
});
