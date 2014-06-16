var obj = require("./utils").object;
var defaultState = require("./default-state");
var redis = require("redis");

module.exports = function(emit, actions, states) {
  

  var firstMoveDone = false;
  var won = false; //hack to ignore second win-message
  var msgList = [];
  var dflt = defaultState(states);
  var redisClient;
  var executingSpecialMove=false;
  redisClient = redis.createClient();

  redisClient.on("error", function (err) {
    console.log("Error " + err);
    console.log('redisClient', redisClient );
  });

  var yourTurn = function() {
    // toEmit is a field,
    // TODO: implement special attacks
    firstMoveDone = true;
    actions.attack(msgList, function(toEmit) {
      emit(toEmit);
      if(toEmit.length>2){
        executingSpecialMove=true;
      }
    });
    msgList = [];
  };
  return obj(dflt, {
    name: "playing",
    enter: function(){
      console.log('entered playing-state');
      setTimeout( function(){
          if( !firstMoveDone ){
            process.exit(1);
          }
        }, 1000
      );
    },
    defaultAction: function(msg) {
      msgList.push(msg);
      if (!executingSpecialMove && [31, 32].indexOf(msg.code) > -1) {
        return yourTurn();
      }
      return dflt.defaultAction(msg);
    },
    29: function(msg){
      msgList.push(msg);
      executingSpecialMove=false;
      yourTurn();
    },
    37: function() {
      redisClient.publish("battleship_loser",actions.name());
      emit("disconnect");
      process.exit(0);
    },
    33: function() {
      if( !won ){
        won = true;
        redisClient.publish("battleship_winner",actions.name());
        emit("disconnect");
        process.exit(0);
      }
    }
  });
};
