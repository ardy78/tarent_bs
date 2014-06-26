module.exports = function(state) {

  var WATER = "water";
  var SHIP = "ship";

  return {

    placeShipsAndMarkWater: function(fields) {
      // successful -> place
      fields.forEach(function(f) {
        state(f).type = SHIP;
  //      console.log("placed ship on field", f.toString());
        // mark corners
        ["nw", "ne", "se", "sw"].forEach(function(corner) {
          var cf = f[corner]();
          if (typeof cf !== "undefined") {
            state(cf).type = WATER;
   //         console.log("DEBUG: marked corner as water, field:", cf.toString());
          }

        });
      });

      // mark endings
      var endFields = [
        fields[0].n(),
        fields[0].w(),
        fields[fields.length - 1].e(),
        fields[fields.length - 1].s()
      ];
      endFields.forEach(function(ef) {

        if (typeof ef !== "undefined") {
          state(ef).type = WATER;
//          console.log("DEBUG: marked border as water, field:", ef.toString());
        }
      });
    },

    checkIfPlacementPossible: function(startField, dir, length) {
      var fields = [];


      var nf = startField;
      for (var i = 0; i < length; i++) {
        if (typeof nf === "undefined") {
          // not enough space
  //        console.log("DEBUG: placement not possible, because of arena bounderaries");
          return false;
        }
        if (typeof state(nf).type !== "undefined") {
          // field is not free
 //         console.log("DEBUG: placement not possible, because field is occupied", nf.toString());
          return false;
        }
 //       console.log("DEBUG: placement possibile on field", nf.toString());
        fields.push(nf);
        nf = fields[i][dir]();
      }
      return fields;
    }
  };
};
