var funFromArray = module.exports.funFromArray = function(ar, offsetN, offsetM) {
  if (typeof offsetN !== "number") {
    offsetN = 0;
  }
  if (typeof offsetM !== "number") {
    offsetM = 0;
  }

  return function(n0, m0) {
    var n = n0 + offsetN;
    var m = m0 + offsetM;
    if (typeof ar[n] === "undefined" || typeof ar[n][m] === "undefined") {
      return 0;
    }
    return ar[n][m];
  };
};

var mapMx = module.exports.mapMx = function(mx, f) {
  return mx.map(function(row, i) {
    return row.map(function(entry, j) {
      return f(entry, i, j);
    });
  });
};

var makeMx = module.exports.makeMx = function(rows, cols, f) {
  var r = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (typeof r[i] === "undefined") {
        r[i] = [];
      }
      r[i][j] = f(i, j);
    }
  }
  return r;
};

var sumMx = module.exports.sumMx = function(rows, cols, f) {
  var r = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      r += f(i, j);
    }
  }
  return r;
};

var dim = module.exports.dim = function(mx) {

  var N = mx.length;
  var M = 0;
  mx.forEach(function(row) {
    if (row && row.length > M) {
      M = row.length;
    }
  });
  return [N,M];
};
