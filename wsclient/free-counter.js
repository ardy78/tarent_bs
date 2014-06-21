module.exports = function(arena) {
  var scan = function(state0) {
    var state = state0.clone();

    var propagate = function(self, preDir) {
      var cache;
      return function() {
        if (typeof cache === "undefined") {
          if (state(self).state === "free") {
            return 0;
          }
          var pre = self[preDir]();
          if (typeof pre === "undefined") {
            return 1;
          }
          cache = state(pre).distance[preDir]() + 1;
        }
        return cache;
      };
    };

    var axes = [{
      a: 'n',
      b: 's'
    }, {
      a: 'w',
      b: 'e'
    }];

    var Fits = function(self) {
      var cache = {};
      return function(length) {
        if (typeof cache[length] === "undefined") {
          var tmp = axes.map(function(axis) {
            var a = state(self).distance[axis.a]();
            var b = state(self).distance[axis.b]();
            return a + b > length ? Math.min(a, b, length) : 0;
          });
          var tmp2 = tmp.reduce(function(sum, c) {
            return sum + c;
          }, 0);
          cache[length] = tmp2;
        }
        return cache[length];
      };
    };


    var Bounds = function(self) {
      var cache;
      return function() {
        if (state(self) !== "occ") {
          return undefined;
        }
        if (typeof cache === "undefined") {
          cache = {
            head: self,
            tail: self
          };
          if (state(self.n()).state === "occ") {
            cache.head = state(self.n()).head();
          }
          if (state(self.w()).state === "occ") {
            cache.head = state(self.w()).head();
          }
          if (state(self.s()).state === "occ") {
            cache.tail = state(self.s()).head();
          }
          if (state(self.e()).state === "occ") {
            cache.tail = state(self.e()).head();
          }
        }
        return cache;
      };
    };

    arena.scan(function(field) {
      state(field).distance = {
        n: propagate(field, 'n'),
        w: propagate(field, 'w'),
        e: propagate(field, 'e'),
        s: propagate(field, 's')
      };
      state(field).fits = Fits(field);
    });

    return state;
  };
  return {
    scan: scan
  };
};
