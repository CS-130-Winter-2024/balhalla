const TICK_RATE = 1000;

var state = [];
var serverRepeater;

var players = {};

function processMessage() {}

function doGameTick() {}

function startServer() {
  serverRepeater = setInterval(doGameTick, 1000);
}

function stopServer() {
  clearInterval(serverRepeater);
}
