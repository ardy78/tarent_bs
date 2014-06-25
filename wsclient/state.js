module.exports = State = function(options) {
  var states = {};
  if (!options) {
    options = {};
  }
  var encode = options.encode;
  var decode = options.decode;
  var transformKey = options.transformKey;

  if (typeof transformKey !== "function") {
    transformKey = function(k) {
      return k;
    };
  }

  if (typeof encode !== "function") {
    encode = function(state, key) {
      var tried = state.tried;
      if (state.type == "water") {
        return tried ? "X" : "x";
      }
      if (state.type == "ship") {
        return tried ? "O" : "o";
      }
      if (state.recommended) {
        return "?";
      }
      return " ";
    };
  }

  if (typeof decode !== "function") {
    decode = function(state, character, key) {
      switch (character) {
        case "x":
          state.type = "water";
          state.tried = false;
          break;
        case "o":
          state.type = "ship";
          state.tried = false;
          break;
        case "X":
          state.type = "water";
          state.tried = true;
          break;
        case "O":
          state.type = "ship";
          state.tried = true;
          break;
        case "?":
          state.recommended = true;
          break;
      }
    };
  }

  var shallowCopy=function(obj){
    var copy = {};
    Object.keys(obj).forEach(function(key){
      copy[key]=obj[key];
    });
    return copy;
  };

  var StateFun = function(states) {

    var stateFun = function(key0) {
      var key = transformKey(key0);
      if (typeof states[key] === "undefined") {
        states[key] = {};
      }
      return states[key];
    };

    stateFun.visualize = function(key) {
      return encode(stateFun(key), key);
    };

    stateFun.interprete = function(key, character) {
      decode(stateFun(key), character, key);
    };

    stateFun.clone = function() {
      var clonedStates = {};
      Object.keys(states).forEach(function(key) {
        clonedStates[key]=shallowCopy(states[key]);
      });
      return StateFun(clonedStates);
    };

    return stateFun;    
  };
  return StateFun(states);
};
