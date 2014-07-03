
describe("The Statistic",function(){
  var Arena = require("../arena.js");
  var Statistic = require("../statistic.js");
  var arena,s, fld;
  beforeEach(function(){
    arena = Arena._16x16();
    s = Statistic(arena);
    fld = arena.field;
  });


  it("records the fields attacked by the oponent",function(){
    s.message({code:  34},fld(0xa2));
    s.message({code:  34},fld(0xc4));
    s.message({code:  34},fld(0xa2));
    expect(s.attackedFields).toEqual([
      fld(0xa2),
      fld(0xc4),
    ]);
  });
  it("ignores attacks that whould have been recommended by the vessel detector",function(){
    s.message({code:  35},fld(0xa2));
    s.message({code:  34},fld(0x92));
    s.message({code:  34},fld(0xa3));
    expect(s.attackedFields).toEqual([
      fld(0xa2),
    ]);
  });

  it("records when we discover an enemy vessel",function(){
    s.message({code: 31},fld(0xa2));
    s.message({code: 31},fld(0xc9));
    expect(s.enemyShipHits).toEqual([
      fld(0xa2),
      fld(0xc9)
    ]);
  });
});
