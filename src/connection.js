import { WebSocketServer } from "ws";
var connections = {};
var tokens = {};
var server;


var handlers = {
    "msg":()=>{},
    "connect":()=>{},
    "disconnect":()=>{}
}

/**
 * Returns the object containing the WebSocket connections.
 *
 * @function getConnections
 * @returns {Object} The object containing the WebSocket connections.
 */
export function getConnections() {
    return connections;
}

/**
 * Associates a username with a WebSocket connection ID.
 *
 * @param {string} connectionID - The unique identifier of the WebSocket connection.
 * @param {string} username - The username to be associated with the connection.
 */
export function login(connectionID, username) {
    tokens[connectionID] = username;
}

/**
 * Removes the association between a WebSocket connection ID and a username.
 *
 * @param {string} connectionID - The unique identifier of the WebSocket connection.
 */
export function logout(connectionID) {
    if (connectionID in tokens)
        delete tokens[connectionID];
}

/**
 * Retrieves the username associated with a WebSocket connection ID.
 *
 * @param {string} connectionID - The unique identifier of the WebSocket connection.
 * @returns {string|null} The username associated with the connection ID, or null if not found.
 */
export function getToken(connectionID) {
    if (connectionID in tokens)
        return tokens[connectionID]
    return null
}

/**
 * Broadcasts a message to all connected WebSocket clients.
 *
 * @param {string} data - The data to be broadcasted to all connected clients.
 */
export function broadcast(data) {
    for (const id in connections) {
        connections[id].send(data);
    }
}

/**
 * Sets a handler function for a specific event or message type.
 *
 * @param {string} key - The event or message type for which the handler is being set.
 * @param {Function} fun - The handler function to be executed when the specified event or message type occurs.
 */
export function setHandler(key, fun) {
    handlers[key] = fun
}

/**
 * Sets up the WebSocket server and handles various WebSocket events.
 *
 * @param {http.Server} httpServer - The HTTP server instance to attach the WebSocket server to.
 */
export function setupWSS(httpServer) {
    server = new WebSocketServer({ server: httpServer, clientTracking: true });
    server.on("connection", function connection(ws) {
        //Generate ID for websocket
        let id = Math.floor(Math.random() * 100000);
        while (id in connections) {
            id = Math.floor(Math.random() * 100000);
        }
        connections[id] = ws;
        
        handlers["connect"](id);
        console.log("[CONNECT] ID:%d", id);

        ws.on("error", console.error); //errors don't happen :)

        ws.on("message", function message(data) {
            handlers["msg"](id,data);
        });

        ws.on("close", function close() {
            console.log("[DISCONNECT] ID:%d", id);
            delete connections[id];
            logout(id);
            handlers["disconnect"](id);
        });
    });
}
