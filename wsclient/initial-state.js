var obj = require("./utils").object;
var defaultState = require("./default-state");

module.exports=function(emit,actions,states){
  return obj(defaultState(states),{
    name:"initial",
    enter: function(){
      if(typeof actions.reset==="function"){
        actions.reset();
      };
      emit("play");

    },
    0: function(){
      return states.busy;
    },
    10: function(){
      return states.placing;
    },
    1: function(){
      emit("rename "+actions.name());
    }
  });
};
