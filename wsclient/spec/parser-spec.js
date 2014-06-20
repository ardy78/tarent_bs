Arena = require("../arena");
Parser = require("../parser");
describe("The Parser", function() {
  var arena, parser;
  beforeEach(function() {
    arena = Arena._10x10();
    parser = Parser(arena);
  });

  it("can parse textual visualizations of an arena", function() {
    var input = [
      "  0 1 2 3 4 5 6 7 8 9",
      "A                 k  ",
      "B                    ",
      "C                    ",
      "D       s            ",
      "E                    ",
      "F                    ",
      "G           c u      ",
      "H                    ",
      "I                    ",
      "J                    "
    ].join("\n");
    var result = {};
    parser.parse(input,function(field,character){
      result[field.toString()]=character;
    });

    expect(result).toEqual({
      a8:'k',
      d3:'s',
      g5:'c',
      g6:'u'
    });
  });

  it("can cope with leading and trailing whitepsace",function(){
    var input = [
      "      0 1 2 3 4 5 6 7 8 9       ",
      "A                 k  ",
      " B                         ",
      "    C                    ",
      "  D       s                        ",
      "  E                    ",
      "    F                    ",
      " G           c u      ",
      "  H                    ",
      "        I                     ",
      "               J                    "
    ].join("\n");
    var result = {};
    parser.parse(input,function(field,character){
      result[field.toString()]=character;
    });

    expect(result).toEqual({
      a8:'k',
      d3:'s',
      g5:'c',
      g6:'u'
    });

  });

  it("can can parse partial and even sparse input",function(){
    var input = [
      "  3 5 6 8",
      "A       k",
      "D s      ",
      "G   c u  "
    ].join("\n");
    var result = {};
    parser.parse(input,function(field,character){
      result[field.toString()]=character;
    });

    expect(result).toEqual({
      a8:'k',
      d3:'s',
      g5:'c',
      g6:'u'
    });

  });

});
