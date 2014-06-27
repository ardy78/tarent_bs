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
  it("can interprete messages itself", function() {
    var fleet = Fleet(arena, ships);

    fleet.message({
      code: 34,
      fld: "C3"
    },fld(0xc3));
    fleet.message({
      code: 34,
      fld: "C5"
    },fld(0xc5));
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
      "c   o o * o x o o o o            ",
      "d                                ",
      "e   o o o o o                    ",
      "f               o o     o o      "
    ].join('\n');
    expect(actual).toEqual(expected);
  });

  it("knows how many hits any of our vessels has taken so far", function() {
    var fleet = Fleet(arena, ships);

    fleet.attacked(fld(0xc3));
    fleet.attacked(fld(0xc3));
    fleet.attacked(fld(0xc1));
    fleet.attacked(fld(0xd4));
    expect(fleet.vesselAt(fld(0xc3)).hits).toEqual([fld(0xc3), fld(0xc1)]);
  });

  it("knows when one our ships is sunk", function() {

    var fleet = Fleet(arena, ships);

    fleet.attacked(fld(0x21));
    fleet.attacked(fld(0x22));
    fleet.attacked(fld(0x51));
    fleet.attacked(fld(0x52));
    fleet.attacked(fld(0x53));
    expect(fleet.vesselAt(fld(0x23)).sunk).toBeFalsy();
    expect(fleet.vesselAt(fld(0x52)).sunk).toBeTruthy();
  });
  it("trusts the server it tells us that our ship is sunk", function() {

    var fleet = Fleet(arena, ships);

    fleet.message({code:36},fld(0x52));
    expect(fleet.vesselAt(fld(0x52)).sunk).toBeTruthy();
  });

  it("knows how many special attacks are initialy available", function() {
    var fleet = Fleet(arena, ships);

    expect(fleet.specials()).toEqual({
      5: 5,
      4: 1,
      3: 3,
      2: 1
    });
  });

  it("sets available special to zero if both ships of a given size have been sunk",function(){
    var fleet = Fleet(arena, ships);
    fleet.message({code:36},fld(0x21));
    fleet.message({code:36},fld(0x51));
    expect(fleet.specials()).toEqual({
      5: 5,
      4: 1,
      3: 0,
      2: 1
    });
  });

  it("decrements specials if when they are used",function(){
    var fleet = Fleet(arena, ships);
    fleet.message({code:41});
    fleet.message({code:42});
    fleet.message({code:42});
    expect(fleet.specials()).toEqual({
      5: 5,
      4: 0,
      3: 1,
      2: 1
    });
  });

  it("records how long (how many misses) it took the enemy to uncover a ship",function(){ 
      
    var fleet = Fleet(arena, ships);
    fleet.message({code:34},fld(0x31));
    fleet.message({code:34},fld(0x21));
    fleet.message({code:35},fld(0x01));
    fleet.message({code:34},fld(0x00));
    fleet.message({code:35},fld(0x02));
    expect(fleet.vesselAt(fld(0x01)).missed).toBe(2);
  });
});
