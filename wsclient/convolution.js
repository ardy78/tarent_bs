var MxUtils = require("./mx-utils.js");
var funFromArray = MxUtils.funFromArray;
var makeMx = MxUtils.makeMx;
var sumMx = MxUtils.sumMx;
var dim =MxUtils.dim;

module.exports = function(imp, resp) {

  var f = funFromArray(imp);
  var g = (function() {
    var d = dim(resp);
    var r0 =  Math.floor(d[0] / 2);
    var c0 = Math.floor(d[1] / 2);
    return funFromArray(resp, r0, c0);
  })();


  var D = dim(imp);
  var N=D[0];
  var M=D[1];

  return makeMx(N,M, function(n, m) {
    return sumMx(N, M, function(i, j) {
      return f(i, j) * g(n - i, m - j);
    });
  });
};
