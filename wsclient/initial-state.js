module.exports=function(emit,actions,states){
  return {
    name:"initial",
    enter: function(){
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
  }
};
