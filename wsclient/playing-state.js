var obj = require("./utils").object;
var defaultState = require("./default-state");

module.exports = function(emit, actions, states) {
  

  var won = false; //hack to ignore second win-message
  var msgList = [];
  var dflt = defaultState(states);
  var executingSpecialMove=false;


  var yourTurn = function() {
    // toEmit is a field,
    // TODO: implement special attacks
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
      msgList=[];
      //yourTurn(); 
      
    },
    defaultAction: function(msg) {
      msgList.push(msg);
      if (!executingSpecialMove && [31, 32].indexOf(msg.code) > -1) {
        return yourTurn();
      }
      return dflt.defaultAction(msg);
    },
    28: function(msg){
      msgList.push(msg);
      executingSpecialMove=false;
    },
    29: function(msg){
      msgList.push(msg);
      executingSpecialMove=false;
      yourTurn();
    },
  });
};
