module.exports.object = function(pt, initializer) {
  var F = function() {};
  F.prototype = pt;
  var o = new F();
  if (initializer) {
    for (var name in initializer) {
      if (initializer.hasOwnProperty(name)) {
        o[name] = initializer[name];
      }
    }
  }
  return o;
};
