var Arena = require("./arena");
var Visualizer = require("./visualizer");
var RedisAdapter = require("./redis-adapter.js");
var arena = Arena._10x10();

var states= {};
var state = function(f){
  if(typeof states[f] === "undefined"){
    states[f]={};
  }
  return states[f];
}

var actions = {
  ohai:function(){
    reset();
    show();
  },
  free: function(f) {
    state(f).state = 'free';
    show();
  },
  occ: function(f) {
    state(f).state = 'occ';
    show();
  },
  recommended: function(f) {
    state(f).recommended = 'true';
    show();
  }
};

var redisAdapter = RedisAdapter(arena, "chr_bot", actions);

var reset = function(){
  states={};
};

var show = function() {
  var cell = function(f) {
//    var tried = triedFields.indexOf(f) >= 0;
    var tried = false;
    if (state(f).state == "free") {
      return tried ? "X" : "x";
    }
    if (state(f).state == "occ") {
      return tried ? "O" : "o";
    }
    if (state(f).recommended) {
      return "?";
    }
    return " ";
  };
  console.log(Visualizer(arena).render(cell));
}

redisAdapter.start();
