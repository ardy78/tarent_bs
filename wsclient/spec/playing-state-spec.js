var PlayingState = require("../playing-state");

describe("The 'Playing State' state", function() {
  var emitCBList = [];

  var state, emit, actions, states, emitted;
  beforeEach(function() {
    emitted = [];
    actions = {};
    states = {};
    emit = function(msg) {
      emitted.push(msg);
      while(emitCBList.length > 0) {
        emitCBList.pop()(msg);
      }
    };
    state = PlayingState(emit, actions, states);
  });

  it("is called 'playing'", function() {
    expect(state.name).toBe("playing");
  });

  it("should call the 'attack' action if it receives the 29 your turn message", function(done) {
    actions.attack = function(msgList, callback) {
      callback("Foo");
    };
    emitCBList.push(function(msg) {
      expect(msg).toEqual("Foo");
      done();
    });

    state[29]({code:29});

  });

  it("should inform the agent about any messages received since the last attack, when calling 'attack' action", function() {
    var msg = {code:34, field: "C5"};
    actions.attack = createSpy("attackSpy");
    state.defaultAction(msg);
    state[29]({code:29});
    expect(actions.attack).toHaveBeenCalledWith([msg, {code:29}], jasmine.any(Function));
  });
});
