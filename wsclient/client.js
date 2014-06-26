module.exports = function(initialState) {
  var state = initialState;

  var process = function(msg) {
    console.log("at ", state.name,msg.code);
    var transition = state[msg.code];
    if (typeof transition != "function") {
      transition = state.defaultAction;
    }
    if (typeof transition == "function") {
      var newState = transition.call(state, msg);
      if (newState && newState != state) {
        triggerEnterAction(newState);
        state = newState;
      }
    }
  };

  var triggerEnterAction = function(state) {
    if (typeof state.enter == "function") {
      state.enter();
    }
  };

  triggerEnterAction(state);

  return {
    process: process
  };
};
