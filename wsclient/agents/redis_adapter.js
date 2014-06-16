var RandomShipPlacement = require("../tools/randomShipPlacement");
var Projection = require("../projection");
module.exports = function() {
  var overlaps = {};
  var freeFields = [];
  var occFields = [];
  var triedFields = [];
  var recommendedFields = [];
  var redis = require("redis");
  var receiver = redis.createClient();
  var transmitter = redis.createClient();
  var channel = "chr_bot";
  var name = "redis_adapter_" + process.pid;
  var fields = [];
  var Field = function(num) {
    var f = fields[num];
    if (typeof f == "undefined") {
      f = {
        name: "abcdefghij" [Math.floor(num / 10)] + (num % 10),
        num: num,
        toString: function() {
          return this.name;
        }
      };
      fields[num] = f;
    }
    return f;
  }

  var ships = {};
  var ship = function(name) {
    var s = ships[name];
    if (typeof f == "undefined") {
      s = {};
      ships[name] = s;
    }
    return s;
  };

  var parseArg = function(part) {
    if (/^\d+$/.test(part)) {
      //numeric field reference
      return Field(parseInt(part));
    }
    if (/^[a-j]\d$/.test(part)) {
      //alphanumeric field reference
      return Field(10 * (part.charCodeAt(0) - "a".charCodeAt(0)) + parseInt(part[1]));
    }
    //anything else: hopefully a Variable reference
    return ship(part);
  };
  var parse = function(message, cb) {
    var parts = message.split(/\s+/);
    var head = parts.shift();
    var matches = /(?:(.+):)?(.+)/.exec(head);
    var pred = matches[2];
    var sender = matches[1] ? matches[1] : "anonymous";
    var args = parts.map(parseArg);
    cb(pred, args, sender);
  };

  var actions = {
    free: function(f) {
      f.state = 'free';
      freeFields.push(f);
    },
    occ: function(f) {
      f.state = 'occ';
      occFields.push(f);
    },
    recommended: function(f) {
      recommendedFields.push(f);
    }
  };

  receiver.on("subscribe", function(channel, count) {
    publish("ohai");
  });
  receiver.on("message", function(channel, message) {
    parse(message, function(pred, args, sender) {
      if (sender === name) {
        return;
      }
      var action = actions[pred];
      var argString = args.map(function(a) {
        return a.toString();
      }).join(" ");
      if (action) {
        console.log("processing", pred, argString, sender);
        action.apply(action, args);
      } else {
       // console.log("ignoring", pred, argString, sender);
      }
    });
  });
  receiver.subscribe(channel);
  var mockShip = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };

  var randomAttackField = function() {
    var f;
    do {
      var col = Math.floor(Math.random() * 10);
      var row = Math.floor(Math.random() * 10);
      f = Field(10 * col + row);
    } while (f.state === 'free' || f.tried)
    return f;
  };
  var publish = function() {
    var args = Array.prototype.slice.call(arguments);
    transmitter.publish(channel, name + ":" + args.join(" "));
  };
  var publishMessages = function(messages) {
    messages.forEach(function(msg) {
      //XXX: better ideas?
      var f = msg.field ? msg.field.toLowerCase() : triedFields[triedFields.length - 1];
      if (!f) {
        return;
      }
      console.log("emit", msg.code, f.name, msg.txt);
      switch (msg.code) {
        case 30:
          actions.free(parseArg(f.toString()));
          publish("free", f);
          break;
        case 31:
          actions.occ(parseArg(f.toString()));
          publish("occ", f);
          break;
        case 32:
          actions.occ(parseArg(f.toString()));
          publish("sunk", f);
          break;
        case 40:
          publish("clusterbombed",f);
          break;
      }
    });

  };

  var show = function() {
    console.log("  0 1 2 3 4 5 6 7 8 9");
    var cell = function(num) {
      var f = Field(num);
      var tried = triedFields.indexOf(f) >= 0;
      if (f.state == "free") {
        return tried ? "X" : "x";
      }
      if (f.state == "occ") {
        return tried ? "O" : "o";
      }
      if (recommendedFields.indexOf(f) >= 0) {
        return "?";
      }
      return " ";
    };
    var row = function(num) {
      return "abcdefghij" [num] + " " + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(col) {
        return cell(num * 10 + col);
      }).join(" ");
    };
    for (var i = 0; i < 10; i++) {
      console.log(row(i))
    }

  }

  var decorateShips = function(delegatee) {
    var commit;
    var decorateEmit = function(emit) {
      return function(fleet) {
        overlaps = Projection.overlaps(fleet);
        commit = function() {
          emit(fleet);
        };
      };
    };
    return function(emit) {
      do{
        delegatee(decorateEmit(emit));
      } while(overlaps[5]<3);
      commit();
      console.log("overlaps", overlaps);
    };
  };

  var attacksCounter = 0;
  return {
    name: function() {
      return "tarent bullship adapt0r";
    },
    /*    ships: function(emit) {
      emit([
        mockShip("d0,e0,f0,g0,h0"),
        mockShip("j0,j1,j2,j3,j4"),
        mockShip("j6,j7,j8,j9"),
        mockShip("e9,f9,g9,h9"),
        mockShip("a9,b9,c9"),
        mockShip("a0,a1,a2"),
        mockShip("a6,a7"),
        mockShip("f4,g4")
      ]);
    },*/
    ships: decorateShips(RandomShipPlacement()),
    attack: function(messages, callback) {
      console.log("attack #" + attacksCounter++);
      publishMessages(messages);
      setTimeout(function() {
        show();
        var f;
        do {
          f = recommendedFields.pop();
        } while (typeof f !== "undefined" && (f.state === 'free' || f.tried))

        if (f) {
          console.log("attacking recommended field", f.name);
          callback(f.name);
        } else {
          f = randomAttackField();
          if(overlaps[5]>0){
            console.log("clusterombing random field",f.name);
            callback("+"+f.name);
            overlaps[5]--;
          }else{
            console.log("attacking random field", f.name);
            callback(f.name);
          }
        }
        f.tried = true;
        triedFields.push(f);
      }, 30);
    }
  };
};
