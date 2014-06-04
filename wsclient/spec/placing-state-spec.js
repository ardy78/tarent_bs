var PlacingState = require("../placing-state");
var mockShip = function(str) {
  return {
    asPlacement: function() {
      return str;
    }
  };
}
/*
 
        Ship([A,1],[A,5]),
        Ship([G,1],[G,5]),
        Ship([C,1],[C,4]),
        Ship([C,6],[C,9]),
        Ship([I,1],[I,3]),
        Ship([E,1],[E,3]),
        Ship([F,7],[G,7]),
        Ship([I,8],[I,9])        
 */

describe("The 'Placing Ships' state", function() {

  var state, emit, actions, states, emitted;
  beforeEach(function() {
    emitted = [];
    actions = {};
    states = {};
    emit = function(msg) {
      emitted.push(msg);
    };
    state = PlacingState(emit, actions, states);
    actions.ships = function() {
      return [
        mockShip("A1,A2,A3,A4,A5"),
        mockShip("G1,G2,G3,G4,G5")];
    };
  });

  it("is called 'placing'", function() {
    expect(state.name).toBe("placing");
  });

  it("asks for ship placements and places first ship when entered", function() {
    state.enter();
    expect(emitted).toEqual(["A1,A2,A3,A4,A5"]);
  });

  it("asks for the next ship and emits it to the server upon receiving 11 place next", function() {
    state.enter();
    state[11]("lustige message");
    expect(emitted).toEqual(["A1,A2,A3,A4,A5", "G1,G2,G3,G4,G5"]);
  });

  it("transitions to state playing when receiving 13 all ready",function(){
    states.playing="playing";
    expect(state[13]()).toBe(states.playing);
  });

  it("transitions to state error when recieving a 90 invalid ship",function(){
    states.error="error";
    expect(state.defaultAction({code:90})).toBe(states.error);
  });
});
