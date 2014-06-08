var obj = require("./utils").object;
var defaultState = require("./default-state");
var redis = require("redis");

module.exports = function(emit, actions, states) {
  var msgList = [];
  var dflt = defaultState(states);
  var redisClient;
  redisClient = redis.createClient();

  redisClient.on("error", function (err) {
    console.log("Error " + err);
    console.log('redisClient', redisClient );
  });

  var yourTurn = function() {
    // toEmit is a field,
    // TODO: implement special attacks
    actions.attack(msgList, function(toEmit) {
      emit(toEmit);
    });
    msgList = [];
  };
  return obj(dflt, {
    name: "playing",
    defaultAction: function(msg) {
      msgList.push(msg);
      if ([29, 31, 32].indexOf(msg.code) > -1) {
        return yourTurn();
      }
      return dflt.defaultAction(msg);
    },
    37: function() {
      redisClient.publish("battleship_loser",actions.name());
      emit("disconnect");
      process.exit(1);
    },
    33: function() {
      redisClient.publish("battleship_winner",actions.name());
      emit("disconnect");
      process.exit(0);
    }
  });
};
