var RandomShipPlacement = require("../tools/randomShipPlacement");
var Projection = require("../projection");
var Arena = require("../arena");
var Visualizer = require("../visualizer");
var RedisAdapter = require("../redis-adapter.js");

module.exports = function(){

  var arena = Arena._10x10();
  var Field = arena.field;
  var overlaps = {};
  var freeFields = [];
  var occFields = [];
  var triedFields = [];
  var recommendedFields = [];
  var actions = {
    initialize: function(publish){
      publish("ohai");
    },
    free: function(f) {
      f.state = 'free';
      freeFields.push(f);
    },
    occ: function(f) {
      f.state = 'occ';
      occFields.push(f);
    },
    recommended: function(f) {
      recommendedFields.push(f);
    }
  };

  var redisAdapter=RedisAdapter(arena, "chr_bot",actions);

  var randomAttackField = function() {
    var f;
    do {
      f = arena.randomField();
    } while (f.state === 'free' || f.tried);
    return f;
  };


  var show = function() {
    var cell = function(f) {
      var tried = triedFields.indexOf(f) >= 0;
      if (f.state == "free") {
        return tried ? "X" : "x";
      }
      if (f.state == "occ") {
        return tried ? "O" : "o";
      }
      if (recommendedFields.indexOf(f) >= 0) {
        return "?";
      }
      return " ";
    };
    console.log(Visualizer(arena).render(cell));
  };
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

  var attacksCounter = 0;

  redisAdapter.start();

  return {
    name: function() {
      return "tarent bullship adapt0r";
    },
    ships: decorateShips(RandomShipPlacement()),
    attack: function(messages, callback) {
      console.log("attack #" + attacksCounter++);
      redisAdapter.processMessages(messages,triedFields[triedFields.length-1]);
      setTimeout(function() {
        show();
        var f;
        do {
          f = recommendedFields.pop();
        } while (typeof f !== "undefined" && (f.state === 'free' || f.tried));

        if (f) {
          console.log("attacking recommended field", f.toString());
          callback(f.toString());
        } else {
          f = randomAttackField();
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
        triedFields.push(f);
        redisAdapter.publish("tried",f);
      }, 30);
    }
  };
};
