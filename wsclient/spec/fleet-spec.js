Fleet = require("../fleet");
Arena = require("../arena");
Visualizer = require("../visualizer.js");
describe("The Fleet", function() {
  var arena, fld, fleet, ships, visualizer;
  beforeEach(function() {
    arena = Arena._16x16();
    fld = arena.field;
    ships = [
      [fld(0x01), fld(0x02), fld(0x03), fld(0x04), fld(0x05)],
      [fld(0xe1), fld(0xe2), fld(0xe3), fld(0xe4), fld(0xe5)],
      [fld(0xc1), fld(0xc2), fld(0xc3), fld(0xc4)],
      [fld(0xc6), fld(0xc7), fld(0xc8), fld(0xc9)],
      [fld(0x51), fld(0x52), fld(0x53)],
      [fld(0x21), fld(0x22), fld(0x23)],
      [fld(0xf7), fld(0xf8)],
      [fld(0xfc), fld(0xfb)],
    ];
    visualizer = Visualizer(arena);

  });

  it("can be initialized with a list of ship configurations", function() {
    var f = Fleet(arena, ships);
  });

  it("can produce nice visualization", function() {
    var actual = visualizer.render(Fleet(arena, ships).visualize);
    var expected = [
      "  0 1 2 3 4 5 6 7 8 9 a b c d e f",
      "0   o o o o o                    ",
      "1                                ",
      "2   o o o                        ",
      "3                                ",
      "4                                ",
      "5   o o o                        ",
      "6                                ",
      "7                                ",
      "8                                ",
      "9                                ",
      "a                                ",
      "b                                ",
      "c   o o o o   o o o o            ",
      "d                                ",
      "e   o o o o o                    ",
      "f               o o     o o      "
    ].join('\n');
    expect(actual).toEqual(expected);
  });

  it("can produce the original array of ships", function() {
    expect(Fleet(arena, ships).ships()).toEqual(ships);
  });

  it("can provide details for all vessels in the fleet", function() {
    var vessels = Fleet(arena, ships).vessels();
    expect(vessels.length).toBe(8);
    expect(vessels.map(function(v) {
      return v.size;
    })).toEqual([5, 3, 3, 4, 4, 5, 2, 2]);
  });

  it("can provide details for the vessel that occopies a given field", function() {
    var vessel = Fleet(arena, ships).vesselAt(fld(0xc3));
    expect(vessel.size).toBe(4);
  });

  it("keeps records of all fields attacked by the enemy", function() {
    var fleet = Fleet(arena, ships);

    fleet.attacked(fld(0xc3));
    fleet.attacked(fld(0xd4));

    var actual = visualizer.render(fleet.visualize);
    var expected = [
      "  0 1 2 3 4 5 6 7 8 9 a b c d e f",
      "0   o o o o o                    ",
      "1                                ",
      "2   o o o                        ",
      "3                                ",
      "4                                ",
      "5   o o o                        ",
      "6                                ",
      "7                                ",
      "8                                ",
      "9                                ",
      "a                                ",
      "b                                ",
      "c   o o * o   o o o o            ",
      "d         x                      ",
      "e   o o o o o                    ",
      "f               o o     o o      "
    ].join('\n');
    expect(actual).toEqual(expected);
  });
});
