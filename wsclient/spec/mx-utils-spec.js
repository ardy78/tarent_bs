MxUtils = require("../mx-utils.js");
describe("The Matrix Tool", function() {
  it("can build a space-discrete function from a matrix", function() {
    var mx = [
      [0, 1, 2, 3],
      [10, 11, 12, 13],
      [20, 21, 22, 23],
    ];

    var f = MxUtils.funFromArray(mx, 1, 2);
    expect(f(0, 0)).toBe(12);
    expect(f(1, 1)).toBe(23);
    expect(f(5, -9)).toBe(0);
    expect(f(-1, -2)).toBe(0);

  });

  it("can apply a function to all elements in a matrix", function() {
    var mx = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3]
    ];
    expect(MxUtils.mapMx(mx, function(elm, i, j) {
      return elm * elm + i + j;
    })).toEqual([
      [1, 1, 2],
      [1, 6, 3],
      [2, 3, 13]
    ]);
  });

  it("can produce a matrix by feeding row/column indizes to a function", function() {
    var f = function(i, j) {
      return i * j;
    };
    expect(MxUtils.makeMx(3, 3, f)).toEqual([
      [0, 0, 0],
      [0, 1, 2],
      [0, 2, 4]
    ]);
  });

  it("can integrate (think: sum up) a 2d discrete function", function() {
    var f = function(i, j) {
      return 3 * i + j;
    };
    expect(MxUtils.sumMx(3, 3, f)).toBe(36);
  });

  it("can detect the dimensions of a matrix", function() {
    var mx = [
      [0, undefined, 0],
      undefined, [],
      [1, 2, 3]
    ];
    expect(MxUtils.dim(mx)).toEqual([4,3]);
  });
});
