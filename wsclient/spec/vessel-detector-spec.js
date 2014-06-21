var Arena = require("../arena.js");
var Parser = require("../parser.js");
var Detector = require("../vessel-detector.js");
var Visualizer = require("../visualizer.js");
var State = require("../state.js");

describe("The vessel detector", function() {
  var arena, parser, field, state, detector, vis;

  var init = function(arena0) {
    arena = arena0;
    parser = Parser(arena);
    vis = Visualizer(arena);
    detector = Detector(arena);
    field = arena.field;
    state = State({
      transformKey: field
    });

  };

  beforeEach(function() {
    init(Arena._10x10());
  });
  it("does detect enemy vessels", function() {

    var input = [
      "  0 1 2",
      "A   o  ",
      "B   o  ",
      "C   o  ",
      "D      ",
    ].join("\n");
    parser.parse(input, state.interprete);
    var vessels = detector.scan(state).vessels;
    expect(vessels.length).toBe(1);
    expect(vessels[0].head).toBe(field("a1"));
    expect(vessels[0].tail).toBe(field("c1"));
    /*
      head: field("a1"),
      tail: field("c1")
      fields: [field("a1"),field("b1"),field("c1")],
      open: [field(d1)],
      closed: [field("a0"), field("a2"), field("b0"), field("b2"), field("c0"), field("c2"), field("d0"), field("d2")],
      minSize: 3,
      maxSize: 5,
      orientation: 'vertical'
     */
  });

  it("keeps track of the surrounding fields and marks them as either free or reccommended", function() {
    var input = [
      "  0 1 2 3 4 5 6 7 8 9",
      "A   o                ",
      "B   o         o o o  ",
      "C                    ",
      "D         o          ",
      "E                    ",
      "F                    ",
      "G             x o o o",
      "H     x              ",
      "I     o              ",
      "J     x              ",
    ].join("\n");
    var expected = [
      "  0 1 2 3 4 5 6 7 8 9",
      "A x o x     x x x x x",
      "B x o x     ? o o o ?",
      "C x ? x x ? x x x x x",
      "D       ? o ?        ",
      "E       x ? x        ",
      "F             x x x x",
      "G             x o o o",
      "H   x x x     x x x x",
      "I   ? o ?            ",
      "J   x x x            ",
    ].join("\n");

    parser.parse(input, state.interprete);
    state= detector.scan(state);
    expect(vis.render(state.visualize)).toEqual(expected);
  });
});
