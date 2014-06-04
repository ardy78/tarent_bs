var obj = require("./utils").object;
var defaultState = require("./default-state");

module.exports = function(emit, actions, states) {
  var msgList = [];
  var dflt = defaultState(states);
  var yourTurn = function() {
    emit(actions.attack(msgList));
    msgList = [];
  };
  return obj(dflt, {
    name: "playing",
    defaultAction: function(msg) {
      msgList.push(msg);
      if([29,31,32].indexOf(msg.code)>-1){
        return yourTurn();
      }
      return dflt.defaultAction(msg);
    }
  });
};
