var Client = require("../client");
var Promise = require("promise");

describe("The protocol-client", function() {
  var client, stateA, stateB, actions;
  var emitted;
  var msg = function(code) {
    return {
      code: code
    };
  };
  var emit = function(str) {
    emitted.push(str);
  };
  beforeEach(function() {
    emitted = [];
    actions = {};
    stateA = {
      name: "stateA",
      enter: function() {},
      0: function(msg) {
        emit("A0");
        return this;
      },
      1: function(msg) {
        emit("A1");
        return stateB;
      }
    };
    stateB = {
      name: "stateB",
      0: function(msg) {
        emit("B0");
        return this;
      },
      1: function(msg) {
        emit("B1");
        return stateA;
      }
    }
  });


  it("processes incoming message by delegating to an internal state", function() {
    client = Client(stateA);
    spyOn(stateA, 1).andCallThrough();
    var m = msg(1);
    client.process(m);
    expect(stateA[1]).toHaveBeenCalledWith(m);
  });

  it("transitions to the state returned by the delegatee", function() {
    client = Client(stateA);
    client.process(msg(1));
    client.process(msg(1));
    client.process(msg(0));
    client.process(msg(0));
    expect(emitted).toEqual(['A1', 'B1', 'A0', 'A0']);
  });

  it("stays in the current state if the delegatee returns a falsy value", function() {
    spyOn(stateA, 1).andCallFake(function() {
      emit("nop");
    });
    client = Client(stateA);
    client.process(msg(1));
    client.process(msg(1));
    expect(emitted).toEqual(['nop', 'nop']);
  });


  it("triggers enter actions of the initial state", function() {
    spyOn(stateA, "enter").andCallThrough();
    client = Client(stateA);
    expect(stateA.enter).toHaveBeenCalled();
  });

  it("triggers enter actions upon entering a new state", function() {
    client = Client(stateA);
    spyOn(stateA, "enter");
    client.process(msg(1));
    expect(stateA.enter).not.toHaveBeenCalled();
    client.process(msg(1));
    expect(stateA.enter).toHaveBeenCalled();
  });

  it("executes a states default action, if nothing was registered for the given message code", function() {
    client = Client(stateA);
    stateA.defaultAction = createSpy("defaultAction").andReturn(stateA);
    var m = msg(42);
    client.process(m);
    expect(stateA.defaultAction).toHaveBeenCalledWith(m);
  });

  it("does nothing if no default action was defined", function() {

    client = Client(stateA);
    var m = msg(42);
    client.process(m);
    expect(emitted).toEqual([]);
  });
});
