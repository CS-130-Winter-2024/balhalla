import { WebSocketServer } from "ws";
var connections = {};
var tokens = {};
var server;


var handlers = {
    "msg":()=>{},
    "connect":()=>{},
    "disconnect":()=>{}
}

export function getConnections() {
    return connections;
}

export function login(connectionID, username) {
    tokens[connectionID] = username;
}

export function logout(connectionID) {
    if (connectionID in tokens)
        delete tokens[connectionID];
}

export function getToken(connectionID) {
    if (connectionID in tokens)
        return tokens[connectionID]
    return null
}

export function broadcast(data) {
    for (const id in connections) {
        connections[id].send(data);
    }
}

export function setHandler(key, fun) {
    handlers[key] = fun
}

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
            logout(id);
            handlers["disconnect"](id);
            delete connections[id];
        });
    });
}
