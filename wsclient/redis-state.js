var State = require("./state.js");
module.exports = function() {
  var EventEmitter = require('events').EventEmitter;
  var emitter = new EventEmitter();

  var state = State();

  var comitted = state.clone();

  state.Connector = function(publish) {
    return {
      occ: function(f) {
        var prev = state(f).state;
        state(f).state = "occ";
        if(state(f).state!=prev){
          emitter.emit('change',state);
        }
      }
    };
  };
  state.on =function(){
    var args = Array.prototype.slice.call(arguments);
    return emitter.on.apply(emitter,args);
  };

  state.commit = function(){
    
  };
  return state;
};
