describe("2d time-discrete convolution", function() {

  var convolve = require("../convolution");

  it("it takes two 2d arrays and convolves them", function() {
    var impulses = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0]
    ];

    var response = [
      [0, 1, 0],
      [1, 2, 1],
      [0, 1, 0]
    ];

    var expected = [
      [0, 1, 0, 0, 0],
      [1, 2, 3, 0, 0],
      [0, 3, 4, 5, 0],
      [0, 0, 5, 6, 3],
      [0, 0, 0, 3, 0],
    ];

    expect(convolve(impulses, response)).toEqual(expected);
  });

  it("does not mess up the orientation of the response matrix", function() {
    var impulses = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 1],
    ];

    var response = [
      [0, 1, 0],
      [1, 2, -1],
      [0, -1, 0]
    ];

    var expected = [
      [0, 0, 0],
      [0, -1, -1],
      [-1, 1, 3]
    ];

    expect(convolve(impulses, response)).toEqual(expected);
  });
  it("does not mess up the orientation of the response matrix", function() {
    var impulses = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0]
    ];

    var response = [
      [0, 1, 0],
      [1, 2, -1],
      [0, -1, 0]
    ];

    var expected = [
      [0, -1, 0, 0, 0],
      [-1, 2, -1, 0, 0],
      [0, -1, 4, -1, 0],
      [0, 0, -1, 6, 3],
      [0, 0, 0, 3, 0],
    ];

    expect(convolve(impulses, response)).toEqual(expected);
  });
});
