var State = require("./state.js");
var Mx = require("./mx-utils.js");
var conv = require("./convolution.js");
module.exports = function(arena, init) {



  var normalize = function(state) {
    sum = 0;
    arena.scan(function(f) {
      var s = state(f);
      if (typeof s.heat === "number") {
        sum += s.heat;
      }
    });
    state = state.clone();
    if (sum !== 0) {
      arena.scan(function(f) {
        var s = state(f);
        if (typeof s.heat === "number") {
          s.heat /= sum;
        }
      });
    }
    return state;
  };

  var convolve = function(state, rsp) {
    var imp = Mx.makeMx(arena.rows(), arena.columns(), function(i, j) {
      var s = state(arena.field(i, j));
      if (typeof s.heat === "undefined") {
        return 0;
      }
      return s.heat;
    });
    var res = conv(imp, rsp);
    state = state.clone();
    arena.scan(function(f) {
      state(f).heat = res[f.row()][f.col()];
    });
    return state;
  };

  var instance = function(state) {
    var hm = function(f) {
      if (typeof state(f).heat === "undefined") {
        return 0;
      }
      return state(f).heat;
    };
    hm.add = function(flds, w) {
      if (typeof w !== "function") {
        w = function() {
          return 1;
        };
      }

      flds.forEach(function(fld, i) {
        var s = state(fld);
        if (typeof s.heat === "undefined") {
          s.heat = 0;
        }
        s.heat += w(fld, i);
      });
    };

    hm.normalize = function() {
      return instance(normalize(state));
    };

    hm.convolve = function(mx) {
      return instance(convolve(state, mx));
    };
    return hm;
  };
  var s0 = State();
  if (typeof init == "function") {
    arena.scan(function(fld) {
      s0(fld).heat = init(fld);
    });
  }
  return instance(s0);
};
