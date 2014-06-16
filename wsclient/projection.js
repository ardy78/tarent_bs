var chars = function(str) {
  return str.replace(/,/g, '').split('');
};
var intersect = function(as, bs) {
  as = as.slice().sort();
  bs = bs.slice().sort();
  var r = [];
  while (as.length && bs.length) {
    if (as[0] < bs[0]) {
      as.shift();
    } else if (as[0] > bs[0]) {
      bs.shift();
    } else {
      r.push(as.shift());
      bs.shift();
    }
  }
  return r;
};
module.exports = {
  overlap: function(a, b) {
    return intersect(chars(a), chars(b)).length;
  },
  overlaps: function(fleet) {
    var pairs = {};
    var overlaps ={};
    fleet.forEach(function(ship){
      var s = ship.asPlacement();
      var l = s.split(',').length;
      if(typeof pairs[l] === "undefined"){
        pairs[l] = [s];
      }else {
        pairs[l].push(s);
      }    
    });
    Object.keys(pairs).forEach(function(l){
      if(pairs[l].length!=2){
        throw new Error("there must be exactly two of any ship size");
      }
      overlaps[l] = module.exports.overlap.apply(module.exports,pairs[l]);
    });
    return overlaps;
  }
};
