RedisState=require("../redis-state");
Arena = require("../arena.js");

describe("The Redis-State connector", function() {
  var connector;
  var publish;
  var arena;
  var field;
  var listener;
  beforeEach(function(){
    arena = Arena._10x10();
    field = arena.field;
    publish = createSpy("publish");
    listener = createSpy("listener");
    state = RedisState();
    connector =state.Connector(publish);
    state.on("change",listener);
  });

  it("updates the state when it learns about new facts from the redis channel", function() {
    connector.occ(field("c5"));
    expect(state(field("c5")).state).toBe("occ");
  });

  it("emits a change-event, whenever the state actualy changes",function(){
    connector.occ(field("c5"));
    connector.occ(field("c5"));
    connector.occ(field("d5"));
    expect(listener.calls.length).toBe(2);
    expect(listener.mostRecentCall.args[0](field("c5")).state).toBe("occ");
    expect(listener.mostRecentCall.args[0](field("d5")).state).toBe("occ");
  });

  it("publishes new facts to the redis channel when local changes are commited",function(done){
    state.on("change",function(){
      state(field("c4")).recommended=true;
      state.commit();
      expect(publish.calls.length).toBe(1);
      expect(publish).toHaveBeenCalledWith("recommended",field("c4"));
      done();
    });
    connector.occ(field("c5"));
  });
});
