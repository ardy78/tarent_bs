
var serverUrl = "ws://localhost:40000/battle"
console.log(process.argv);
if(process.argv.length > 2){
  serverUrl = process.argv[1];
}
console.log("url",serverUrl);
var WebSocket = require('ws');
var Message = require('./message');
var ws = new WebSocket(serverUrl);
ws.on('open', function() {
    ws.send('play');
});
ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
    console.log(">",data);
    var msg=Message(data);
    console.log(msg.code, msg.field);
    if(msg.code==10){
      ws.send("defaultships");
    }
    if(msg.code==29){
      var col = Math.floor(Math.random()*10);
      var row = Math.floor(Math.random()*10);
      ws.send("ABCDEFGHIJ"[col]+(row+1));
    }
});
