var players = {};
// list of player usernames a client has added to scene

const SAMPLE_UPDATE = {
  playerid: {
    x: 0,
    z: 0,
    hasBall: false,
  },
  playerid2: {
    x: 0,
    z: 0,
    hasBall: false,
  },
};

const SAMPLE_MODEL_UPDATE = {
  playerid: {
    newModel: 7,
  },
};

//Add player to scene and player list
export function addPlayer(playerID, data) {
  // Must check if playerID already exists
  players[playerID] = data;

  //add 3d model to model group
  //PHILIP and GIANG
}

function removePlayer(playerID) {}

// receiving massive update from server to update all player statuses.
// If player is not in player list, cannot update them.
// Called on server update message
function updatePlayers(update) {
  players = {
    ...players,
    ...update,
  };

  //update 3d models with players json
}

//update the 3d models of the players using the "players" object
//called every frame
function updatePlayerModels() {}

//ThreeJS function for displaying all the players
function getPlayerModelGroup() {}
