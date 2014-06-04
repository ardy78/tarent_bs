var InitialState = require("../initial-state");

describe("The initial state", function() {
  var state, emit, actions,states;
  beforeEach(function() {
    emit = createSpy("emit");
    actions = {};
    states ={};
    state = InitialState(emit, actions,states);
  });

  it("is called 'initial'",function(){
    expect(state.name).toBe("initial");
  });

  it("emits 'play' when entered", function() {
    state.enter();
    expect(emit).toHaveBeenCalledWith("play");
  });

  it("emits bot name when receiving 01 hello",function(){
    actions.name = function(){
      return "FooBot42";
    }
    var newState=state[1]();
    expect(newState).toBeFalsy();
    expect(emit).toHaveBeenCalledWith("rename FooBot42");
  });

  it("transits to final state 'busy' when receiving 00 busy",function(){
    states.busy="busy";
    expect(state[0]()).toBe("busy");
  });

  it("transits to state 'placing' when receivin 10 place ships",function(){
    states.placing="placing";
    expect(state[10]()).toBe("placing");
  });
});
