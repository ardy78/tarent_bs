var WebSocket = require('ws');
var Message = require('./message');
var Client = require('./client');

module.exports=function(serverUrl, agent){
  
  var client;
  var ws = new WebSocket(serverUrl);

  ws.on('open', function() {
    var emit = function(str) {
      if( str == "disconnect" ){
        console.log("disconnect:", agent);
        ws.close();
        return;
      }
      ws.send(str);
    };

    var actions = require('./agents/' + agent)();

    var states = {};
    states.initial = require('./initial-state')(emit, actions, states);
    states.placing = require('./placing-state')(emit, actions, states);
    states.playing = require('./playing-state')(emit, actions, states);

    client = Client(states.initial);

  });
  ws.on('message', function(data, flags) {
    console.log("incoming", data);
    client.process(Message(data));
  });

  ws.on('close', function(data, flags){
    // 
  });

};
