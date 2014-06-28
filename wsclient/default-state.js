module.exports=function(states){
  return {
    defaultAction: function(msg){
      if(msg.code>=90){
//        throw new Error("so nicht.");
        return states.error;
      }
    },
    9:function(){
      return states.initial;
    },
    37:function(){
      return states.initial;
    },
    33:function(){
      return states.initial;
    }
  };
};
