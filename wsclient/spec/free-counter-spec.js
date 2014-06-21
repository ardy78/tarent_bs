var Arena = require("../arena.js");
var Parser = require("../parser.js");
var Counter = require("../free-counter.js");
var Visualizer = require("../visualizer.js");
var State = require("../state.js");
describe("The Free-Counter", function() {
  var arena, parser, field, state, counter, vis;

  var init = function(arena0) {
    arena = arena0;
    parser = Parser(arena);
    vis = Visualizer(arena);
    counter = Counter(arena);
    field = arena.field;
    state = State({
      transformKey: field
    });

  };

  beforeEach(function() {
    init(Arena._10x10());
  });


  it("counts the distance (in either direction) to the next field that is known to be empty", function() {
    var input = [
      "  0 1 2 3 4 5 6 7 8 9",
      "A x o x o   x        ",
      "B x o x              ",
      "C x x x              ",
      "D                    ",
      "E                    ",
      "F                    ",
      "G                    ",
      "H                    ",
      "I                    ",
      "J                    ",
    ].join("\n");
    parser.parse(input, state.interprete);
    state = counter.scan(state);
    expect(state("a4").distance.w()).toEqual(2);
    expect(state("j4").distance.s()).toEqual(1);
    expect(state("c2").distance.n()).toEqual(0);
    expect(state("c2").distance.w()).toEqual(0);
    expect(state("c2").distance.e()).toEqual(0);
  });

  it("counts the number of ways a ship of a given length could overlap with a given field", function() {
    init(Arena._10x10({
      rows: 5,
      columns: 5
    }));
    var input = [
      "  0 1 2 3 4",
      "A   x   x  ",
      "B   x   x  ",
      "C          ",
      "D   x   x  ",
      "E   x   x  "
    ].join("\n");

    var  expected= [
      "  0 1 2 3 4",
      "A 1 0 1 0 1",
      "B 2 0 2 0 2",
      "C 4 2 6 2 4",
      "D 2 0 2 0 2",
      "E 1 0 1 0 1"
    ].join("\n");
    parser.parse(input,state.interprete);
    state=counter.scan(state);
    expect(vis.render(function(f){
      return state(f).fits(3);
    })).toEqual(expected);

  });
});
