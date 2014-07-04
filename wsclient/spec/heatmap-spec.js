describe("A Heatmap", function() {
  var Arena = require("../arena.js");
  var HeatMap = require("../heatmap.js");
  var arena, fld, hm;
  beforeEach(function() {
    arena = Arena._16x16();
    fld = arena.field;
    hm = HeatMap(arena);
  });


  it("can be initialized with a heatmap-like function",function(){
    hm = HeatMap(arena,function(fld){
      return fld.num();
    });
    arena.scan(function(fld){
      expect(hm(fld)).toBe(fld.num());
    
    });
  });

  it("accumulates impulses", function() {
    hm.add([fld(0xa5), fld(0xb6), fld(0xc7)]);
    hm.add([fld(0xa6), fld(0xb6), fld(0xc6)]);
    expect(hm(fld(0xa5))).toBe(1.0);
    expect(hm(fld(0xa6))).toBe(1.0);
    expect(hm(fld(0xb6))).toBe(2.0);
    expect(hm(fld(0xc6))).toBe(1.0);
    expect(hm(fld(0xc7))).toBe(1.0);
  });

  it("optionaly applies a custom weight function to impulses", function() {
    var w = function(fld, i) {
      return 1 / (1 + i);
    };
    hm.add([fld(0xa5), fld(0xb6), fld(0xc7)], w);
    hm.add([fld(0xa6), fld(0xb6), fld(0xc6)], w);
    expect(hm(fld(0xa5))).toBe(1.0);
    expect(hm(fld(0xa6))).toBe(1.0);
    expect(hm(fld(0xb6))).toBe(1.0);
    expect(hm(fld(0xc6))).toBe(1 / 3);
    expect(hm(fld(0xc7))).toBe(1 / 3);

  });

  it("can be normalized, such that the sum over all fields is 1", function() {
    var w = function(fld, i) {
      return 1 / (1 + i);
    };
    hm.add([fld(0xa5), fld(0xb6), fld(0xc7)], w);
    hm.add([fld(0xa6), fld(0xb6), fld(0xc6)], w);

    hm = hm.normalize();

    expect([0xa5, 0xa6, 0xb6, 0xc6, 0xc7].reduce(function(s, c) {
      return s + hm(fld(c));
    }, 0)).toBe(1);

  });

  it("can be convolved with an arbitrary real matrix", function() {
    hm.add([fld(0xa5), fld(0xb6), fld(0xc7)]);

    hm = hm.convolve([
      [1, 0, 0],
      [-1, 1, 0],
      [0, 0, 0],
    ]);

    expect([
      0xa5, 0xa6, 0xa7,
      0xb5, 0xb6, 0xb7,
      0xc5, 0xc6, 0xc7
    ].map(function(f) {
      return hm(fld(f));
    })).toEqual([
      1, -1, 0,
      0, 2, -1,
      0, 0, 2
    ]);


  });

});
