var RandomShipPlacement = require("../tools/randomShipPlacement");
var Projection = require("../projection");
var Arena = require("../arena");
var Visualizer = require("../visualizer");
var State = require("../state");
var VesselDetector = require("../vessel-detector.js");
var FreeCounter = require("../free-counter.js");

var shuffle = require('knuth-shuffle').knuthShuffle;

module.exports = function() {
  var lastAttackedField;
  var arena = Arena._16x16();
  var visualizer = Visualizer(arena);
  var Field = arena.field;
  var vesselDetector = VesselDetector(arena);
  var freeCounter = FreeCounter(arena);
  var state = State();
  var decorateShips = function(delegatee) {
    var commit;
    var decorateEmit = function(emit) {
      return function(fleet) {
        overlaps = Projection.overlaps(fleet);
        commit = function() {
          emit(fleet);
        };
      };
    };
    return function(emit) {
      do {
        delegatee(decorateEmit(emit));
      } while (overlaps[5] < 3);
      commit();
      console.log("overlaps", overlaps);
    };
  };

  var processMessage = function(msg) {
    var f = msg.field ? Field(msg.field) : lastAttackedField;
    if (!f) {
      return;
    }
    var interprete = {
      30: function(f) {
        state(f).type = "water";
      },
      31: function(f) {
        state(f).type = "ship";
      },
      32: function(f) {
        console.log("TODO: implement sunk 32");
      },
      40: function(f) {
        console.log("TODO: implement clusterbombed 40");
      }
    }[msg.code];

    if (typeof interprete !== "undefined") {
      interprete(f);
    }
  };


  var N = function(n){
    var r=[];
    for(var i;i<n;i++){
      r.push(i);
    }
    return r;
  };

  var byNumberOfFitsDescending=function(a,b){
    var fits=function(f){
      return [5,5,4,4,3,3,2,2].reduce(function(prev,cur){
        return prev + state(f).fits(cur);
      },0);
    };
    return fits(b)-fits(a);
  };

  var createRandomFields = function(){
    var fields = N(arena.rows()*arena.columns()).map(function(n){return arena.field(n);});
    shuffle(fields);
    fields.sort(byNumberOfFitsDescending);
    return fields;
  };

  return {
    name: function() {
      return "tarent bullship adapt0r";
    },
    ships: decorateShips(RandomShipPlacement()),
    attack: function(messages, callback) {

      messages.forEach(processMessage);

      state = vesselDetector.scan(state);
      state = freeCounter.scan(state);

      console.log(visualizer.render(state.visualize));
      var f;
      
      var recommendedFields = arena.filter(function(f){return state(f).recommended;});
      var randomFields = createRandomFields();

      do {
        f = recommendedFields.pop();
      } while (typeof f !== "undefined" && (state(f).type || state(f).tried));

      if (f) {
        console.log("attacking recommended field", f.toString());
        callback(f.toString());
      } else {
        do {
          f = randomFields.pop();
        } while (typeof f !== "undefined" && (state(f).type || state(f).tried));
        if (overlaps[5] > 0) {
          console.log("clusterombing random field", f.toString());
          callback("+" + f.toString());
          overlaps[5]--;
        } else {
          console.log("attacking random field", f.toString());
          callback(f.toString());
        }
      }
      f.tried = true;
    }
  };
};
