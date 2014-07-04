var Mx = require("./mx-utils.js");

/** creates a gaussian filter kernel **/
module.exports = function(N, sigma) {
  if (typeof sigma !== "number") {
    sigma = 1;
  }
  if (typeof N !== "number") {
    N = 5;
  }
  var c = N / 2;

  var exp = Math.exp;
  var pow = Math.pow;
  var PI = Math.PI;

  var kernel = Mx.makeMx(N, N, function(i, j) {
    return exp(-0.5 * (pow((i - c) / sigma, 2.0) + pow((j - c) / sigma, 2.0))) / (2 * PI * sigma * sigma);
  });

  var sum = Mx.sumMx(N, N, function(i, j) {
    return kernel[i][j];
  });

  return Mx.mapMx(kernel, function(e) {
    return e / sum;
  });


};
