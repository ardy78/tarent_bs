module.exports = function(arena, channel,actions0,reflect) {
  var redis = require("redis");
  var receiver = redis.createClient();
  var transmitter = redis.createClient();
  var name = "redis_adapter_" + process.pid;
  var Field = arena.field;
  var actions;

  var parseFact = function(string, cb) {
    var parts = string.split(/\s+/);
    var head = parts.shift();
    var matches = /(?:(.+):)?(.+)/.exec(head);
    var pred = matches[2];
    var sender = matches[1] ? matches[1] : "anonymous";
    
    var args = parts.map(function(part){
      if(part.match(/^\d+$/)){
        return Field(parseInt(part));
      }
      return Field(part);
    });

    cb(pred, args, sender);
  };


  var publish = function() {
    var args = Array.prototype.slice.call(arguments);
    transmitter.publish(channel, name + ":" + args.join(" "));
    console.log("emit", name + ":" + args.join(" "));
  };

  var processMessage = function(msg, lastAttackedField) {
    var f = msg.field ? Field(msg.field) : lastAttackedField;
    if (!f) {
      return;
    }
    var pred = {
      30: "free",
      31: "occ",
      32: "sunk",
      40: "clusterbombed"
    }[msg.code];
    if(typeof pred!=="undefined"){
      publish(pred, f);
      processFact(pred, [f], name);
    }
  };

  var processMessages = function(msgs, lastAttackedField) {
    msgs.forEach(function(msg) {
      processMessage(msg, lastAttackedField);
    });
  };

  var processFact = function(pred, args, sender) {
    var action = actions[pred];
    var argString = args.map(function(a) {
      return a.toString();
    }).join(" ");
    if (action) {
      console.log("processing", pred, argString, sender);
      action.apply(action, args);
    }
  };

  receiver.on("subscribe", function(channel, count) {
    if(typeof actions0 ==="function"){
      actions = actions0(publish);
    }
    else{
      actions = actions0;
    }
    if (typeof actions.initialize === "function") {
      actions.initialize(publish);
    }
  });
  receiver.on("message", function(channel, message) {
    parseFact(message, function(pred, args, sender) {
      if (reflect||sender !== name) {
        processFact(pred, args, sender);
      }
    });
  });

  return {
    start:function(){
      receiver.subscribe(channel);
    },
    publish:publish,
    processMessages: processMessages
  };
};
