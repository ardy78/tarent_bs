var Visualizer = require("../visualizer");
var Arena = require("../arena");
describe("The Visualizer", function() {

  it("generates pretty output by mapping the arena through a callback function", function() {
    var vis = Visualizer(Arena._10x10());
    var expected = [
      "  0 1 2 3 4 5 6 7 8 9",
      "A o x o x o x o x o x",
      "B x o x o x o x o x o",
      "C o x o x o x o x o x",
      "D x o x o x o x o x o",
      "E o x o x o x o x o x",
      "F x o x o x o x o x o",
      "G o x o x o x o x o x",
      "H x o x o x o x o x o",
      "I o x o x o x o x o x",
      "J x o x o x o x o x o",
    ].join('\n');
    expect(vis.render(function(f) {
      return (f.col() + f.row()) % 2 ? 'x' : 'o';
    })).toEqual(expected);
  });

  it("lays out multiple grids in coluns when given more than one callback", function() {
    var vis = Visualizer(Arena._10x10());
    var expected = [
      "  0 1 2 3 4 5 6 7 8 9      0 1 2 3 4 5 6 7 8 9",
      "A o x o x o x o x o x    A # + - - - - - - - -",
      "B x o x o x o x o x o    B + # + - - - - - - -",
      "C o x o x o x o x o x    C - + # + - - - - - -",
      "D x o x o x o x o x o    D - - + # + - - - - -",
      "E o x o x o x o x o x    E - - - + # + - - - -",
      "F x o x o x o x o x o    F - - - - + # + - - -",
      "G o x o x o x o x o x    G - - - - - + # + - -",
      "H x o x o x o x o x o    H - - - - - - + # + -",
      "I o x o x o x o x o x    I - - - - - - - + # +",
      "J x o x o x o x o x o    J - - - - - - - - + #"
    ].join('\n');
    expect(vis.render(function(f) {
      return (f.col() + f.row()) % 2 ? 'x' : 'o';
    }, function(f) {
      switch (Math.abs(f.col() - f.row())) {
        case 0:
          return "#";
        case 1:
          return "+";
        default:
          return "-";
      }
    })).toEqual(expected);
  });

});
