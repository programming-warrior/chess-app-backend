const PORT = 7000;
const express = require('express');
// const http = require("http");
const app = express();
const Router=express.Router();
// const httpServer = http.createServer(app);
const expressWs=require('express-ws')(app);
// const webSocketServer = require('websocket').server;
const userRoutes=require('./routes/userRoutes');
const validateMove = require('./controllers/validateMove');

let connections = {};
let rooms = {};
//rooms data structure example
//e.g.
/*
{
 'roomId':{
    players: {
        dR_WU: { clientId: 'dR_WU', col: 'w', turn: [Getter] },
        qHppy: { clientId: 'qHppy', col: 'w', turn: [Getter] }
    },
    check:{
        kingCol,
        kingPos,
        attackingPos,
        attackingPiece,
    }
    canShortCastle:['w','b'],
    canLongCastle:['w','b']
    boardPos: {
        a1: 'r-w',
        b1: 'kn-w',
        c1: 'b-w',
        ...
    }
}

*/



const initialPos = {
    a1: "r-w",
    b1: "kn-w",
    c1: "b-w",
    d1: "q-w",
    e1: "k-w",
    f1: "b-w",
    g1: "kn-w",
    h1: "r-w",
    a8: "r-b",
    b8: "kn-b",
    c8: "b-b",
    d8: "q-b",
    e8: "k-b",
    f8: "b-b",
    g8: "kn-b",
    h8: "r-b",
    a2: "p-w",
    b2: "p-w",
    c2: "p-w",
    d2: "p-w",
    e2: "p-w",
    f2: "p-w",
    g2: "p-w",
    h2: "p-w",
    a7: "p-b",
    b7: "p-b",
    c7: "p-b",
    d7: "p-b",
    e7: "p-b",
    f7: "p-b",
    g7: "p-b",
    h7: "p-b",
    a3: "",
    b3: "",
    c3: "",
    d3: "",
    e3: "",
    f3: "",
    g3: "",
    h3: "",
    a4: "",
    b4: "",
    c4: "",
    d4: "",
    e4: "",
    f4: "",
    g4: "",
    h4: "",
    a5: "",
    b5: "",
    c5: "",
    d5: "",
    e5: "",
    f5: "",
    g5: "",
    h5: "",
    a6: "",
    b6: "",
    c6: "",
    d6: "",
    e6: "",
    f6: "",
    g6: "",
    h6: "",
};

//function to generate unique clientIds
const generateUniqueId = () => {
    let len = 5;
    const str = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!*$@-_";
    let result = "";
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * str.length);
        result += str[randomIndex];
    }
    return result;
}

// const websocket = new webSocketServer({
//     "httpServer": httpServer
// })


app.use('/api',userRoutes);

app.ws('/',(con,request)=>{

        // con = request.accept(null, 'http://localhost:3000');
   
        const clientId = generateUniqueId();
        let roomId;
    
        if (!connections.hasOwnProperty(clientId)) {
            connections[clientId] = con;
        }
    
        connections[clientId].on('message', (data) => {
            const { event, message } = JSON.parse(data);
    
            if (event === "join-room") {
                roomId = message;
                if (rooms.hasOwnProperty(roomId) && rooms[roomId].hasOwnProperty('players') && Object.keys(rooms[roomId]['players']).length >= 2) {
    
                    connections[clientId].send(JSON.stringify({ event: "room-full", message: "room is full" }));
                }
                else {
    
                    const col = ['w', 'b'];
                    let playerData = {
                        clientId,
                        col: col[Math.floor(Math.random() * col.length)],
                        get turn() {
                            return this.col == 'w' ? 1 : 0;
                        }
                    }
    
                    if (!rooms[roomId]) {
                        //if one of the player has joined the room then initialize the room
                        rooms[roomId] = {};
                        rooms[roomId]["players"] = {};
                        rooms[roomId]["boardPos"] = { ...initialPos };
                        rooms[roomId]['check'] = {
                            kingPos: '',
                            kingCol: "",
                            attackingPos: [],
                            attackingPiece: [],
                        }
                        rooms[roomId]['canShortCastle'] = ['w', 'b'];
                        rooms[roomId]['canLongCastle'] = ['w', 'b'];
                        rooms[roomId]['currentPlayer'] = 'w';
                    }
    
                    rooms[roomId]['players'][clientId] = playerData;
    
                    //check for if the players have gotten the same color
                    const clientInRoomId = Object.entries(rooms[roomId]['players']);
    
                    if (clientInRoomId.length > 1 && clientInRoomId[0][1].col === playerData.col) {
                        playerData.col = playerData.col === 'w' ? 'b' : 'w';
                    }
    
                    //if both the players have entered the room start the game
                    if (clientInRoomId.length == 2) {
                        connections[clientInRoomId[0][0]].send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[0][1] }, boardPos: rooms[roomId]["boardPos"] }) }));
                        connections[clientInRoomId[1][0]].send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[1][1] }, boardPos: rooms[roomId]["boardPos"] }) }));
                    }
                }
            }
    
            if (event === 'piece-move') {
                const { startingPosition, movedPosition, piece } = message;
                const sender = rooms[roomId]['players'][clientId].col;
                const currentPlayer = rooms[roomId]['currentPlayer'];
                const clientInRoomId = Object.entries(rooms[roomId]['players']);
    
                if (sender === currentPlayer) {
                    if (validateMove(startingPosition, movedPosition, piece, rooms[roomId])) {
                        rooms[roomId]['currentPlayer'] = rooms[roomId]['currentPlayer'] === 'w' ? 'b' : 'w';
                        connections[clientInRoomId[0][0]].send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'] } }));
                        connections[clientInRoomId[1][0]].send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'] } }));
                    }
                }
    
            }
        })
    
        connections[clientId].on('close', () => {
            //delete the clientId from the room 
            if (rooms[roomId]) {
                delete rooms[roomId]['players'][clientId];
            }
    
            if (rooms[roomId] && Object.keys(rooms[roomId]['players']).length === 0) {
                delete rooms[roomId];
            }
            //delete the client from the connections
            delete connections[clientId];
        })

})




app.listen(PORT, () => {
    console.log(`app is listening on port${PORT}`);
})