var State = require("../state");
describe("The State-function", function() {
  var state;
  beforeEach(function() {

    state = State();
  });
  it("always returns an object", function() {
    expect(state()).toEqual(any(Object));
    expect(state("foo")).toEqual(any(Object));
    expect(state({
      bar: "baz"
    })).toEqual(any(Object));

  });

  it("can be cloned",function(){
    state(1).bar={baz:1};
    var clone = state.clone();
    expect(clone(1)).not.toBe(state(1));
    expect(clone(1)).toEqual(state(1));
    expect(clone(1).bar).toBe(state(1).bar);
  });

  it("always returns the same object for the same argument", function() {
    expect(state("foo")).toBe(state("foo"));
  });

  it("can be customized with a key transformation",function(){
    var trans = function(x){
      return x.toLowerCase();
    };
    state = State({transformKey:trans});
    expect(state("bla")).toBe(state("BLA"));
  });

  it("provides suitable callbacks for parser and visualizer",function(){
    expect(state.visualize).toEqual(any(Function));
    expect(state.interprete).toEqual(any(Function));
  });

  it("visualizes state=free/occ as x/o by default", function() {
    state(1).type = "water";
    state(2).type = "ship";
    expect(state.visualize(1)).toBe("x");
    expect(state.visualize(2)).toBe("o");
  });

  it("visualizes attacked fields as upper case letter", function() {
    state(1).type = "water";
    state(1).tried = true;
    state(2).type = "ship";
    state(2).tried = true;
    expect(state.visualize(1)).toBe("X");
    expect(state.visualize(2)).toBe("O");
  });
  it("visualizes recommondations with a '?'", function() {
    state(1).recommended=true;
    expect(state.visualize(1)).toBe("?");
  });

  it("supports custom visualization callbacks", function() {
    var cb = createSpy("cb").andReturn("!");
    state = State({
      encode: cb
    });
    state("f").barf = "bang";
    expect(state.visualize("f")).toEqual("!");
    expect(cb).toHaveBeenCalledWith({
      barf: "bang"
    }, "f");
  });

  it("interpretes 'X' as explicit (i.e. tried) state=free", function(){
    state.interprete(1,'X');
    expect(state(1)).toEqual({type:"water",tried:true});
  });
  it("interpretes 'o' as implicit (i.e. not tried) state=occ", function(){
    state.interprete(1,'o');
    expect(state(1)).toEqual({type:"ship",tried:false});
  });
  it("interpretes '?' as recommendation", function(){
    state.interprete(1,'?');
    expect(state(1)).toEqual({recommended:true});
  });

});
