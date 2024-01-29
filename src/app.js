// const http = require("http");
// const httpServer = http.createServer(app);
// const webSocketServer = require('websocket').server;
const PORT = 7000;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);
const url=require('url');
const { connect } = require('./controllers/db/connection');
const { verifyToken, verifyTokenSocket } = require('./controllers/token/token');
const generateRoomId = require('./controllers/generateRandomId');
const {startClock,stopClock}=require('./controllers/clockLogic');

connect((db) => {
    console.log('connected');
    app.use((req, res, next) => {
        req.db = db;
        next();
    })

    const userRoutes = require('./routes/userRoutes');

    app.use(cors({
        origin: 'http://localhost:3000',
    }))

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', userRoutes);

    const validateMove = require('./controllers/chess_logic/validateMove');
    let connections = {};
    let rooms = {};
    //rooms data structure example
    //e.g.
    /*
    {
     'roomId':{
        players: {
            dR_WU: { clientId: 'dR_WU', col: 'w', time:(in ms),turn: [Getter] },
            qHppy: { clientId: 'qHppy', col: 'w', time,:(in ms),turn: [Getter] }
        },
        check:{
            kingCol,
            kingPos,
            attackingPos,
            attackingPiece,
        },
        currentPlayer:'w',
        checkMate:{
            status:"true"
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

    app.get('/initializeRoom', verifyToken, (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const gameType=query['type'];
        if(['rapid','blitz','bullet'].indexOf(gameType)<=-1){
            return res.status(401).end();
        }
        const roomId = generateRoomId();
        //initialize the room
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
        rooms[roomId]['checkMate']={
            status:false,
        };
        rooms[roomId]['type']=gameType;
        res.status(201).json({
            roomId,
        })
    })

    app.ws('/', verifyTokenSocket, (con, request) => {
        // con = request.accept(null, 'http://localhost:3000');
        let clientId = request.username;
        let roomId;

        if (!connections.hasOwnProperty(clientId)) {
            connections[clientId] = con;
        }




        con.on('message', (data) => {
            const { event, message } = JSON.parse(data);
            if (event === 'reestablish-connection') {



                const { username } = message;
                //check if this username exists in any room
                for (id in rooms) {
                    if (rooms[id].players.hasOwnProperty(username)) {
                        //player was in a game 
                        clientId = username;
                        connections[username] = con;
                        const data = {
                            event: "join-previous-game",
                            message: {
                                roomId: id,
                            }
                        }
                        return con.send(JSON.stringify(data));
                    }
                }
                //check if this username is in connection object
                if (connections.hasOwnProperty(username)) {
                    clientId = username;
                    connections[username] = con;
                    const data = {
                        event: "connection-reestablished",
                        message: {}
                    }
                    return con.send(JSON.stringify(data));
                }
            }

            if (event === "join-room") {
     
                roomId = message.roomId;
                if (!rooms.hasOwnProperty(roomId)) {
                    return connections[clientId]?.send(JSON.stringify({ event: "invalid-roomId", message: "" }));
                }
                if (rooms[roomId]['players'].hasOwnProperty(clientId)) {
                    return connections[clientId]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...rooms[roomId]['players'][clientId] }, boardPos: rooms[roomId]["boardPos"] }) }))
                }
                if (rooms.hasOwnProperty(roomId) && rooms[roomId].hasOwnProperty('players') && Object.keys(rooms[roomId]['players']).length >= 2) {

                    return connections[clientId]?.send(JSON.stringify({ event: "room-full", message: "room is full" }));
                }
                const col = ['w', 'b'];
                let playerData = {
                    clientId,
                    col: col[Math.floor(Math.random() * col.length)],
                    get turn() {
                        return this.col == 'w' ? 1 : 0;
                    }
                }

                rooms[roomId]['players'][clientId] = playerData;

                //check for if the players have gotten the same color
                const clientInRoomId = Object.entries(rooms[roomId]['players']);

                if (clientInRoomId.length > 1 && clientInRoomId[0][1].col === playerData.col) {
                    playerData.col = playerData.col === 'w' ? 'b' : 'w';
                }

                //if both the players have entered the room start the game
                if (clientInRoomId.length == 2) {
                    let timeControl=3*100;
                    if(rooms[roomId]['type']==='rapid'){
                        timeControl=10*60*100;
                    }
                    else if(rooms[roomId]['type']==='blitz'){
                        timeControl=3*60*100;
                    }
                    else if(rooms[roomId]['type']==='bullet'){
                        timeControl=1*60*100;
                    }
                    //set the time control
                    rooms[roomId]['players'][clientInRoomId[1][0]]['time']=timeControl;
                    rooms[roomId]['players'][clientInRoomId[0][0]]['time']=timeControl;

                    startClock(connections,rooms[roomId]);

                    connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[0][1] }, boardPos: rooms[roomId]["boardPos"] }) }));
                    connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[1][1] }, boardPos: rooms[roomId]["boardPos"] }) }));
                }
            }

            if (event === 'piece-move') {
                const { startingPosition, movedPosition, piece } = message;
                const sender = rooms[roomId]['players'][clientId].col;
                const currentPlayer = rooms[roomId]['currentPlayer'];
                const clientInRoomId = Object.entries(rooms[roomId]['players']);

                if (sender === currentPlayer) {
                    if (validateMove(startingPosition, movedPosition, piece, rooms[roomId])) {
                        if(rooms[roomId]['checkMate']['status']){
                            connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "game-over", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner:currentPlayer} }));
                            connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "game-over", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner:currentPlayer }}));
                            stopClock(rooms[roomId]['clock']);
                            return;
                        }

                        rooms[roomId]['currentPlayer'] = rooms[roomId]['currentPlayer'] === 'w' ? 'b' : 'w';
                        connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'] } }));
                        connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'] } }));
                    }
                }

            }
        })

        connections[clientId].on('close', () => {

            //delete the client from the connection
            connections[clientId] = null;

            //if the players have logged out then remove the room
            if (roomId && rooms[roomId]) {
                const playerIds = Object.keys(rooms[roomId]['players']);

                console.log(playerIds);
                if (!connections[playerIds[0]] && !connections[playerIds[1]]) {
                    stopClock(rooms[roomId]);
                    delete rooms[roomId];
                }
            }

        })

    })


    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`);
    })
})





