var serverUrl = "ws://localhost:40000/battle";
var agent = "default";
console.log(process.argv);
if (process.argv.length > 2) {
  agent = process.argv[2]; 
}
if (process.argv.length > 3) {
  serverUrl = process.argv[3];
}
console.log("using server url: ",serverUrl);
console.log("using agent: ", agent);

require('./ws-client')(serverUrl, agent);
