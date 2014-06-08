var serverUrl = "ws://localhost:40000/battle"
var agent = "default";
console.log(process.argv);
if (process.argv.length > 2) {
  serverUrl = process.argv[1];
}
if (process.argv.length > 3) {
  agent = process.argv[2]; 
}
console.log("url", serverUrl);

require('./ws-client')(serverUrl, agent);
