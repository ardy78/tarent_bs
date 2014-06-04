var obj = require("./utils").object;
var defaultState = require("./default-state");

module.exports = function(emit, actions, states) {
  var msgList = [];
  var dflt=defaultState(states);
  return obj(dflt, {
    name: "playing",
    29: function yourTurn() {
      emit(actions.attack(msgList));
      msgList = [];
    },
    defaultAction: function(msg){
      msgList.push(msg);
      return dflt.defaultAction(msg);
    }
  });
};
