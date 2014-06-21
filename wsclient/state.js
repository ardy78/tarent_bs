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
      if (state.state == "free") {
        return tried ? "X" : "x";
      }
      if (state.state == "occ") {
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
          state.state = "free";
          state.tried = false;
          break;
        case "o":
          state.state = "occ";
          state.tried = false;
          break;
        case "X":
          state.state = "free";
          state.tried = true;
          break;
        case "O":
          state.state = "occ";
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
