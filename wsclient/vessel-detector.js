module.exports = function(arena) {



  var scan = function(state0) {
    var state = state0.clone();
    state.vessels = [];
    arena.scan(function(field) {
      var s = state(field);

      if (s.state === "occ") {
        var n = field.n();
        var w = field.w();
        var sn = n ? state(n) : undefined;
        var sw = w ? state(w) : undefined;
        s.vessel = {
          head: field,
          tail: field,
          fields: [field]
        };

        if (sn && sn.state === "occ") {
          s.vessel = sn.vessel;
          s.vessel.orientation = "vertical";
          s.vessel.fields.push(field);
          s.vessel.tail = field;
        } else if (sw && sw.state === "occ") {
          s.vessel = sw.vessel;
          s.vessel.orientation = "horizontal";
          s.vessel.fields.push(field);
          s.vessel.tail = field;
        } else {
          state.vessels.push(s.vessel);
        }
      }
    });

    var processPerimeter = function(vessel) {
      var done = [];
      vessel.closed = [];
      vessel.open = [];
      var mark = function() {
        var fields = Array.prototype.slice.call(arguments);
        var val = fields.shift();
        fields.forEach(function(f) {
          if (done.indexOf(f) > -1) {
            return;
          }
          if (val == "closed") {
            state(f).state = "free";
            vessel.closed.push(f);
          }
          if (val == "open") {
            state(f).recommended = true;
            vessel.open.push(f);
          }
        });
      };
      vessel.fields.forEach(function(f) {
        mark("closed", f.nw(), f.ne(), f.sw(), f.se());
      });
      [vessel.head, vessel.tail].forEach(function(f) {
        mark("open", f.n(), f.s(), f.w(), f.e());
      });
    };
    state.vessels.forEach(processPerimeter);

    return state;
  };
  return {
    scan: scan
  };
};
