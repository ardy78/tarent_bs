var Arena = require("./arena");
var Visualizer = require("./visualizer");
var RedisAdapter = require("./redis-adapter.js");

var arena = Arena._10x10();

var states = {};
var state = function(f) {
  if (typeof states[f] === "undefined") {
    states[f] = {};
  }
  return states[f];
}
var readline = require('readline');
var setupCli = function(publish) {


  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.setPrompt('OHAI> ');
  rl.prompt();

  rl.on('line', function(line) {
    publish(line);
    rl.prompt();
  }).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
  });
};

var actions = {
  initialize:setupCli,
  ohai: function() {
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
    state(f).recommended = true;
    show();
  },
  tried: function(f){
    state(f).tried = true;
    show();
  }
};

var redisAdapter = RedisAdapter(arena, "chr_bot", actions,true);

var reset = function() {
  states = {};
};

var show = function() {
  var cell = function(f) {
    var tried = state(f).tried;
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

