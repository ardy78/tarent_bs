module.exports = function(arena) {
  var attackedFields = [];
  var hits = [];
  var State = require("./state.js");
  var VesselDetector = require("./vessel-detector.js");
  var Visualizer = require("./visualizer.js");
  var state = State();
  var vis = Visualizer(arena);
  var vesselDetector = VesselDetector(arena);

  var rememberEnemyAttack = function(fld) {
    if (attackedFields.indexOf(fld) !== -1) {
      return;
    }
    if (state(fld).recommended) {
      return;
    }
    attackedFields.push(fld);
  };

  var rememberEnemyShipHit = function(fld){
    if(hits.indexOf(fld)!== -1){
      return;
    }
    hits.push(fld);
  };

  return {
    message: function(msg, fld) {
      state = vesselDetector.scan(state);
      switch (msg.code) {
        case 34: //missed
          state(fld).type = "water";
          rememberEnemyAttack(fld);
          break;
        case 35: //hit
          state(fld).type = "ship";
          rememberEnemyAttack(fld);
          break;
        case 36: //sunk
          rememberEnemyAttack(fld);
          break;
        case 31: //sunk
          rememberEnemyShipHit(fld);
          break;
        case 32: //sunk
          rememberEnemyShipHit(fld);
          break;


      }
    },
    attackedFields: attackedFields,
    enemyShipHits:hits
  };
};
