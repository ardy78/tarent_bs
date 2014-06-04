var PlayingState = require("../playing-state");

describe("The 'Playing State' state", function() {
  var state, emit, actions, states, emitted;
  beforeEach(function() {
    emitted = [];
    actions = {};
    states = {};
    emit = function(msg) {
      emitted.push(msg);
    };
    state = PlayingState(emit, actions, states);
  });

  it("is called 'playing'", function() {
    expect(state.name).toBe("playing");
  });

  it("should call the 'attack' action if it receives the 29 your turn message", function() {
    actions.attack = function(msgList) {
      return "Foo";
    };
    state[29]({});

    expect(emitted).toEqual(["Foo"]);
  });

  it("should inform the agent about any messages received since the last attack, when calling 'attack' action", function() {
    var msg = {code:34, field: "C5"};
    actions.attack = createSpy("attackSpy");
    state.defaultAction(msg);
    state[29]({});
    expect(actions.attack).toHaveBeenCalledWith([msg]);
  });
});
