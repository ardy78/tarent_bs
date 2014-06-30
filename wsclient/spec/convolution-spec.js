describe("2d time-discrete convolution", function() {

  var convolve = require("../convolution");

  it("it takes two 2d arrays and convolves them", function() {
    var impulses = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0]
    ];

    var response = [
      [0, 1, 0],
      [1, 2, 1],
      [0, 1, 0]
    ];

    var expected = [
      [0, 1, 0, 0, 0],
      [1, 2, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 2, 1],
      [0, 0, 0, 1, 0],
    ];

    expect(convolve(impulses,response)).toEqual(expected);
  });
});
