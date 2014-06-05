var PlacingState = require("../placing-state");
var mockShip = function(str) {
  return {
    asPlacement: function() {
      return str;
    }
  };
}

describe("The 'Placing Ships' state", function() {
  var emitCBList = [];
  var state, emit, actions, states, emitted;
  beforeEach(function() {
    emitted = [];
    actions = {};
    states = {};
    emit = function(msg) {
      emitted.push(msg);
      while(emitCBList.length>0){
        emitCBList.pop()(msg)
      }
    };
    state = PlacingState(emit, actions, states);
    actions.ships = function(emitPlacement) {
      emitPlacement ([
        mockShip("A1,A2,A3,A4,A5"),
        mockShip("G1,G2,G3,G4,G5")
      ]);
    };
  });

  it("is called 'placing'", function() {
    expect(state.name).toBe("placing");
  });

  it("asks for ship placements and places first ship when entered", function(done) {
    emitCBList.push(function(msg) {
      expect(msg).toEqual("A1,A2,A3,A4,A5");
      done();
    });
    state.enter();
  });

  it("asks for the next ship and emits it to the server upon receiving 11 place next", function(done) {
//    emitCBList.push(function(msg) {
//      expect(msg).toEqual("A1,A2,A3,A4,A5");
//    });
    state.enter();
  
    emitCBList.push(function(msg) {
      expect(msg).toEqual("G1,G2,G3,G4,G5");
      done();
    });

    expect(state[11]("lustige message")).toBeUndefined();
  });

  it("transitions to state playing when receiving 13 all ready", function() {
    states.playing = "playing";
    expect(state[13]()).toBe(states.playing);
  });

  it("transitions to state error when recieving a 90 invalid ship", function() {
    states.error = "error";
    expect(state.defaultAction({
      code: 90
    })).toBe(states.error);
  });
});
