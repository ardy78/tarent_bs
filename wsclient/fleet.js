VesselDetector = require("./vessel-detector.js");
State = require("./state.js");
Projection = require("./projection.js");

module.exports = function(arena, ships) {
  var flatten = function(input) {
    return Array.prototype.concat.apply([], input);
  };

  var Ship = function(ar) {
    return {
      asPlacement: function() {
        return ar.map(function(f) {
          return f.toString();
        }).join(",");
      }
    };
  };
  var specials = Projection.overlaps(ships.map(Ship));

  var state = State();
  flatten(ships).forEach(function(f) {
    state(f).type = "ship";
  });
  state = VesselDetector(arena).scan(state);
  var vessels = state.vessels.forEach(function(v) {
    var d = v.orientation === "vertical" ? v.tail.row() - v.head.row() : v.tail.col() - v.head.col();
    v.size = 1 + d;
  });
  var visualize = (function() {
    return function(f) {
      if (state(f).type === "ship") {
        return state(f).attacked ? "*" : "o";
      }

      return state(f).attacked ? "x" : " ";
    };

  })();
  return {
    visualize: visualize,
    ships: function() {
      return ships;
    },
    vessels: function() {
      return state.vessels;
    },
    vesselAt: function(f) {
      return state(f).vessel;
    },
    attacked: function(f) {
      state(f).attacked = true;
      var v = state(f).vessel;
      if (v) {
        if (typeof v.hits === "undefined") {
          v.hits = [];
        }
        if (v.hits.indexOf(f) === -1) {
          v.hits.push(f);
        }
        v.sunk = v.hits.length >= v.size;

      }
    },
    specials: function() {
      var sunkCounts = {
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      this.vessels().filter(function(v) {
        return v.sunk;
      }).map(function(v) {
        return v.size;
      }).forEach(function(size) {
        sunkCounts[size]++;
      });

      Object.keys(sunkCounts).forEach(function(size) {
        if (sunkCounts[size] > 1) {
          specials[size] = 0;
        }
      });

      return specials;
    },
    message: function(m, f) {
      switch (m.code) {
        case 34:
        case 35:
          this.attacked(f);
          break;
        case 36:
          this.vesselAt(f).sunk = true;
          break;
        case 40: //clusterbomb used, 5
          specials[5]--;
          break;
        case 41: //wildfire used, 4
          specials[4]--;
          break;
        case 42: //drone used, 3
          specials[3]--;
          break;
        case 43: //torpedo used, 2
          specials[2]--;
          break;
        default:
          //notttin.
      }
      console.log("fleet: "+specials);
    }
  };
};
