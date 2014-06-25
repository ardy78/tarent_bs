var StateHelper = require("../tools/stateHelper");
var State = require('../state');
var Arena = require('../arena');

describe("The State-Helper", function() {
  var state;
  var stateHelper;
  var arena = Arena._16x16();
  beforeEach(function() {
    state = State();
    stateHelper = StateHelper(state);
  });
  describe("can check if a ship placement is possible", function() {
    it("and returns the fields that the ship will occupy if successful", function() {
      var startField = arena.field(0);
      var fields = stateHelper.checkIfPlacementPossible(startField, "e", 5);
      expect(fields[0]).toBe(arena.field(0));
      expect(fields[1]).toBe(arena.field(1));
      expect(fields[4]).toBe(arena.field(4));
      expect(fields.length).toEqual(5);
    });
    it("and returns false if ship placement is not possible", function() {
      state(arena.field(1)).type = "occ";

      var startField = arena.field(0);
      var fields = stateHelper.checkIfPlacementPossible(startField, "e", 5);

      expect(fields).toBeFalsy();
    });
  });
  it("places a ship and marks surrounding fields as water", function() {
      var fields = [arena.field(0x11), arena.field(0x12)];
      stateHelper.placeShipsAndMarkWater(fields);

      [0x00,0x01,0x02,0x03,0x10,0x13,0x20,0x21,0x22,0x23].forEach(function(f) {
        var field = arena.field(f);
        expect(state(field).type).toEqual("free");
        
        if(state(field).type != "free") {
          console.log("field", field.toString(), "is not marked as free");
        }

      });
  });
});
