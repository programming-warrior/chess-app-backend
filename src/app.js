// const http = require("http");
// const httpServer = http.createServer(app);
// const webSocketServer = require('websocket').server;

const PORT = 7000;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);
const url = require('url');
app.use(require('express-status-monitor')())

const storeGame = require('./controllers/db/storeGame');
const { verifyToken, verifyTokenSocket } = require('./controllers/token/token');
const generateRoomId = require('./controllers/generateRandomId');
const { startClock, stopClock } = require('./controllers/clockLogic');
const bcrypt = require('bcrypt');

const checkDetection = require('./controllers/chess_logic/checkDetection');
const checkMateDetection = require('./controllers/chess_logic/checkMateDetection');


const { connect } = require('./controllers/db/connection');
const asyncHook=require('async_hooks');
const fs=require('fs');

// asyncHook.createHook({
//     init(asyncId,type,triggerAsyncId){
//         const id=asyncHook.executionAsyncId();
//         fs.writeSync(1,`${type} ${asyncId} : trigger ${triggerAsyncId} execution ${id}\n`);
//     }
// }).enable();

connect((db) => {
    console.log('connected');

    app.use((req, res, next) => {
        req.db = db;
        next();
    })

    const userRoutes = require('./routes/userRoutes');
    const tokenRoutes = require('./routes/tokenRoutes');

    app.use(cors({
        origin:'*',
        credentials:true
    }))

    // app.use(cookieParser);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    app.use('/api', userRoutes);
    app.use('/auth', tokenRoutes);

    const validateMove = require('./controllers/chess_logic/validateMove');
    let connections = {};
    let rooms = {};
    //map for refreshToken and the user
    let refrshTokens={};
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
        },
        bMoves:[],
        wMoves:[],
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
        const gameType = query['type'];
        if (['rapid', 'blitz', 'bullet'].indexOf(gameType) <= -1) {
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
        rooms[roomId]['checkMate'] = {
            status: false,
        };
        rooms[roomId]['type'] = gameType;
        rooms[roomId]['b'] = [];
        rooms[roomId]['w'] = [];
        rooms[roomId]['queening'] = { col: null ,pawn:null};

        res.status(201).json({
            roomId,
        })
    })


    app.ws('/', verifyTokenSocket, (con, request) => {
        // con = request.accept(null, 'http://localhost:3000');
        let clientId = request.username;
        let roomId;


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

                const data = {
                    event: "connection-forbidden",
                    message: {}
                }
                //delete the refresh token also
                return con.send(JSON.stringify(data));
            }
            if (event === 'connected') {
                connections[clientId] = con;
            }
            //if the connected event doesn't reach the server
            if (!connections.hasOwnProperty(clientId)) {
                connections[clientId] = con;
            }


            if (event === 'game-started') {
                if (!rooms[roomId]['clock']) {
                    startClock(connections, rooms[roomId]);
                }
            }

            if (event === "join-room") {

                roomId = message.roomId;
                if (!rooms.hasOwnProperty(roomId)) {
                    return connections[clientId]?.send(JSON.stringify({ event: "invalid-roomId", message: "" }));
                }

                if (rooms[roomId]['players'].hasOwnProperty(clientId)) {
                    const blackPlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'b') {
                            return true;
                        }
                    })

                    const whitePlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'w') {
                            return true;
                        }
                    })
                    return connections[clientId]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...rooms[roomId]['players'][clientId] }, boardPos: rooms[roomId]["boardPos"], clock: { w: rooms[roomId]['players'][whitePlayerId]?.['time'], b: rooms[roomId]['players'][blackPlayerId]?.['time'] }, usernames: { w: whitePlayerId, b: blackPlayerId } }) }))
                }
                if (rooms.hasOwnProperty(roomId) && rooms[roomId].hasOwnProperty('players') && Object.keys(rooms[roomId]['players']).length >= 2) {
                    return connections[clientId]?.send(JSON.stringify({ event: "room-full", message: {} }));
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
                    let timeControl = 3 * 100;
                    if (rooms[roomId]['type'] === 'rapid') {
                        timeControl = 10 * 60 * 100;
                    }
                    else if (rooms[roomId]['type'] === 'blitz') {
                        timeControl = 3 * 60 * 100;
                    }
                    else if (rooms[roomId]['type'] === 'bullet') {
                        timeControl = 1 * 60 * 100;
                    }
                    //set the time control
                    rooms[roomId]['players'][clientInRoomId[1][0]]['time'] = timeControl;
                    rooms[roomId]['players'][clientInRoomId[0][0]]['time'] = timeControl;

                    const blackPlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'b') {
                            return true;
                        }
                    })
                    const whitePlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'w') {
                            return true;
                        }
                    })

                    connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[1][1] }, boardPos: rooms[roomId]["boardPos"], clock: { w: rooms[roomId]['players'][whitePlayerId]?.['time'], b: rooms[roomId]['players'][blackPlayerId]?.['time'] }, usernames: { w: whitePlayerId, b: blackPlayerId } }) }));
                    connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "game-start", message: JSON.stringify({ player: { ...clientInRoomId[0][1] }, boardPos: rooms[roomId]["boardPos"], clock: { w: rooms[roomId]['players'][whitePlayerId]?.['time'], b: rooms[roomId]['players'][blackPlayerId]?.['time'] }, usernames: { w: whitePlayerId, b: blackPlayerId } }) }));
                }
            }

            if (event === 'piece-move') {
                //when in queening stage player is not allowed to move any piece
                if (rooms[roomId]['queening']['col']) return;

                const { startingPosition, movedPosition, piece } = message;
                const sender = rooms[roomId]['players'][clientId].col;
                const currentPlayer = rooms[roomId]['currentPlayer'];
                const clientInRoomId = Object.entries(rooms[roomId]['players']);

                if (sender === currentPlayer) {
                    if (validateMove(startingPosition, movedPosition, piece, rooms[roomId])) {
                        if (rooms[roomId]['checkMate']['status']) {
                            stopClock(rooms[roomId]);

                            //save the game into the database
                            const blackPlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                                if (rooms[roomId]['players'][e]['col'] === 'b') {
                                    return true;
                                }
                            })
                            const whitePlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                                if (rooms[roomId]['players'][e]['col'] === 'w') {
                                    return true;
                                }
                            })
                            const gameState = {
                                gameId: roomId,
                                boardPos: rooms[roomId]['boardPos'],
                                b: {
                                    moves: [...rooms[roomId]['b']],
                                    playerId: blackPlayerId,
                                },
                                w: {
                                    moves: [...rooms[roomId]['w']],
                                    playerId: whitePlayerId
                                },
                                winner: rooms[roomId]['currentPlayer']
                            }
                            storeGame(request.db.collection('games'), gameState);
                            connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "checkmate", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner: currentPlayer } }));
                            connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "checkmate", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner: currentPlayer } }));
                            delete rooms[roomId];
                            return;
                        }

                        if (rooms[roomId]['queening']['col'] && rooms[roomId]['queening']['pawn']) {
                            if (rooms[roomId]['queening']['col'] === 'w') {
                                const whitePlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                                    if (rooms[roomId]['players'][e]['col'] === 'w') {
                                        return true;
                                    }
                                })
                                return connections[whitePlayerId]?.send(JSON.stringify({ event: "queening", message: {...rooms[roomId]['queening']} }));
                            }

                            if (rooms[roomId]['queening']['col'] === 'b') {
                                const blackPlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                                    if (rooms[roomId]['players'][e]['col'] === 'b') {
                                        return true;
                                    }
                                })
                                return connections[blackPlayerId]?.send(JSON.stringify({ event: "queening", message: {...rooms[roomId]['queening']} }));
                            }
                        }


                        rooms[roomId]['currentPlayer'] = rooms[roomId]['currentPlayer'] === 'w' ? 'b' : 'w';


                        let counter = 0;
                        const moves = [];
                        while (counter < rooms[roomId]['w'].length && counter < rooms[roomId]['b'].length) {
                            moves.push(rooms[roomId]['w'][counter]);
                            moves.push(rooms[roomId]['b'][counter]);
                            counter++;
                        }
                        if (counter < rooms[roomId]['w'].length) {
                            moves.push(rooms[roomId]['w'][counter]);
                        }

                        connections[clientInRoomId[0][0]]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'], moves } }));
                        connections[clientInRoomId[1][0]]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'], moves } }));
                    }
                }

            }
            
            if(event==='queening-declared'){
                const {promotion,player,pawn}=message;
                if(player===rooms[roomId]['queening']['col'] && pawn===rooms[roomId]['queening']['pawn'] && ['q','kn','r','b'].indexOf(promotion)>-1){
                    rooms[roomId]['boardPos'][pawn]=`${promotion}-${player}`;
                    rooms[roomId]['queening']['col']=null;
                    rooms[roomId]['queening']['pawn']=null;

                    //look for check and checkmate
                    checkDetection(pawn, pawn, `${promotion}-${player}`, rooms[roomId]['check'], rooms[roomId]['boardPos']);

                    if (rooms[roomId].check.kingPos && rooms[roomId].check.kingCol) {
                      if (checkMateDetection(rooms[roomId].check, rooms[roomId].boardPos)) {
                        rooms[roomId].checkMate.status = true;
                      }
                    }

                    const blackPlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'b') {
                            return true;
                        }
                    })
                    const whitePlayerId = Object.keys(rooms[roomId]['players']).find((e) => {
                        if (rooms[roomId]['players'][e]['col'] === 'w') {
                            return true;
                        }
                    })

                    //if there is checkmate, then send gameOver event
                    if (rooms[roomId]['checkMate']['status']) {
                        stopClock(rooms[roomId]);

                        //save the game into the database
                    
                        const gameState = {
                            gameId: roomId,
                            boardPos: rooms[roomId]['boardPos'],
                            b: {
                                moves: [...rooms[roomId]['b']],
                                playerId: blackPlayerId,
                            },
                            w: {
                                moves: [...rooms[roomId]['w']],
                                playerId: whitePlayerId
                            },
                            winner: rooms[roomId]['currentPlayer']
                        }
                        storeGame(request.db.collection('games'), gameState);
                        connections[whitePlayerId]?.send(JSON.stringify({ event: "checkmate", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner: rooms[roomId]['currentPlayer'] } }));
                        connections[blackPlayerId]?.send(JSON.stringify({ event: "checkmate", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], winner: rooms[roomId]['currentPlayer'] } }));
                        delete rooms[roomId];
                        return;
                    }

                    rooms[roomId]['currentPlayer'] = rooms[roomId]['currentPlayer'] === 'w' ? 'b' : 'w';
                    let counter = 0;
                    const moves = [];
                    while (counter < rooms[roomId]['w'].length && counter < rooms[roomId]['b'].length) {
                        moves.push(rooms[roomId]['w'][counter]);
                        moves.push(rooms[roomId]['b'][counter]);
                        counter++;
                    }
                    if (counter < rooms[roomId]['w'].length) {
                        moves.push(rooms[roomId]['w'][counter]);
                    }

                    connections[blackPlayerId]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'], moves } }));
                    connections[whitePlayerId]?.send(JSON.stringify({ event: "move-validated", message: { boardPos: rooms[roomId]["boardPos"], check: rooms[roomId]['check'], currentPlayer: rooms[roomId]['currentPlayer'], moves } }));
                }
            }
        })

        con.on('close', () => {
            console.log(request.rawHeaders);
            //delete the client from the connection
            connections[clientId] = null;
            console.log(clientId + " closing");
            //if the players have logged out then remove the room
            if (roomId && rooms[roomId]) {
                const playerIds = Object.keys(rooms[roomId]['players']);

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





