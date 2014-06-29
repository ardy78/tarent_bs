module.exports = function(weights, random) {
  if (typeof random !== "function") {
    random = Math.random;
  }
  var acc = [];
  for (var i = 0; i < weights.length; i++) {
    acc[i] = weights[i];
    if (i > 0) {
      acc[i] += acc[i - 1];
    }
  }

  var s = acc[acc.length -1];
  if(s===0){
    throw new Error("weights sum up to zero?!");
  }
  if (s !== 1) {
    acc = acc.map(function(v){return v/s;});
  }

  var search0 = require("./segment-search.js");
  var search = function(d) {
    return search0(acc, d);
  };

  return function() {
    var d = random();
    return search(d);
  };
};
