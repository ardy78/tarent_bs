var ShipSunkHandler = require("../tools/shipSunkHandler");
var State = require('../state');
var Arena = require('../arena');
var Parser = require('../parser.js');
var Visualizer = require("../visualizer.js");

describe("The ShipSunkHandler", function() {
  var state;
  var handler;
  var arena = Arena._16x16();
  var visualizer = Visualizer(arena);
  var parser = Parser(arena);
  beforeEach(function() {
    state = State();
    handler = ShipSunkHandler();
  });

  var full = function(input){
    var s = State();
    parser.parse(input,s.interprete);
    return visualizer.render(s.visualize);
  };

  it("handles the case when a ship is sunk based on a single field. It removes the sunk ship from the remaining ships", function() {
    var anyField = arena.field(0x11);

    state(anyField.e()).type = "ship";
    state("enemyShips").remaining = [2,3,3,4,2];

    var newState = handler.handleSunkShip(state, anyField);

    expect(newState(anyField).type).toEqual("ship");
    expect(newState(anyField.e()).type).toEqual("ship");
    expect(newState("enemyShips").remaining).toEqual([3,3,4,2]);
  });

  it("marks the remaining open fields of the ships perimeter as type:water",function(){


    var input = [
      "  a b c d",
      "0 x ? x  ",
      "1 x o x  ",
      "2 x o x  ",
      "3 x ? x  "
    ].join('\n');

    var expected = full([
      "  a b c d",
      "0 x x x  ",
      "1 x o x  ",
      "2 x o x  ",
      "3 x x x  "
    ].join('\n'));


    state("enemyShips").remaining = [2,3,3,4,2];
    parser.parse(input,state.interprete);
    var newState = handler.handleSunkShip(state, arena.field(0x1b));
    expect(newState(arena.field(0x3b)).type).toBe("water");
    expect(newState(arena.field(0x0b)).type).toBe("water");
    expect(visualizer.render(newState.visualize)).toEqual(expected);
  });
});
