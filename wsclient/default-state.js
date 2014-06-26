module.exports=function(states){
  return {
    defaultAction: function(msg){
      if(msg.code>=90){
        return states.error;
      }
    },
    9:function(){
      return states.initial;
    }
  };
};
