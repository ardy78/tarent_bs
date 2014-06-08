process.on('SIGTERM', function(){
    console.log('terminating');
    process.exit(1);
});

var CommandLine = require("node-commandline").CommandLine;
var commandLine = new CommandLine('test_agent.js');
commandLine.addArgument('agent1',{type: 'string'})
           .addArgument('agent2',{type: 'string'})
           .addArgument('rep',{type: 'string'})
           .addArgument('serverUrl',{type: 'string'});


//var command = commandLine.parseNode(process.argv[0],process.argv[1],process.argv[2],process.argv[3]);
try{
  var command = commandLine.parseNode.apply(commandLine,process.argv);
}catch( e ){
  console.log('Syntax: %s', commandLine);
  process.exit(1);
}

console.log( JSON.stringify(command) );

var serverUrl   = command.serverUrl || "ws://localhost:40000/battle";
var agent1      = command.agent1    || "default";
var agent2      = command.agent2    || "default";
var repetitions = command.rep       || 100;

var wins = [];
var losses = [];
var regLoss = 0;
var regWin = 0;
var roundsPlayed = 0;

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on("error", function(err){
  console.log( "Couldn't create redis client: " + err);
});

redisClient.on( "message", function(channel, message){ 
debugger;
  console.log( "Channel '" + channel + "' published: " + message );
  if( channel === 'battleship_winner') { 
    regWin++;  
    wins[message] = wins[message] ? (wins[message] + 1) : 1;
  };
  if( channel === 'battleship_loser') { 
    regLoss++;  
    losses[message] = losses[message] ? (losses[message] + 1) : 1;
  };
  if( regWin == 2 && regLoss == 1 && roundsPlayed < repetitions) {
    roundsPlayed++;
    regWin = 0;
    regLoss = 0;
    startRound();
  }
});

redisClient.subscribe("battleship_winner");
redisClient.subscribe("battleship_loser");

var startRound = function(){
  var wsc1 = require('./ws-client')(serverUrl, agent1);
  var wsc2 = require('./ws-client')(serverUrl, agent2);
  console.log('wsc1+2: ',wsc1,wsc2);
}

startRound();
