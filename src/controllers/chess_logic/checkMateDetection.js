const getMoves = require('./getMoves');
const kingBetweenMove = require('./kingBetweenMove');
const isProtected = require('./isProtected');
const checkforPin = require('./checkforPin');

const checkMateDetection = (check, boardPos) => {
    const legalMoves = [];
    let kingSqr = '';
    for (let key in boardPos) {
        if (boardPos[key] === `k-${check.kingCol}`) {
            kingSqr = key;
        }
    }
    for (let square in boardPos) {
        if (boardPos[square].split('-')[1] === check.kingCol) {
            const type = boardPos[square].split('-')[0];
            let moves = [];
            let isPinned = false;
            switch (type) {
                case "p": {
                    moves = getMoves.pawn(square, boardPos[square], boardPos);
                    break;
                }
                case "kn": {
                    moves = getMoves.knight(square, boardPos[square], boardPos);
                    break;
                }

                case "q": {
                    moves = getMoves.queen(square, boardPos[square], boardPos);
                    break;
                }
                case "b": {
                    moves = getMoves.bishop(square, boardPos[square], boardPos);
                    break;
                }
                case "r": {
                    moves = getMoves.rook(square, boardPos[square], boardPos);
                    break;
                }
                case 'k': {
                    moves = getMoves.king(square, boardPos[square], boardPos);
                }
            }

            if (type !== 'k' && kingSqr) {
                isPinned = checkforPin(square, boardPos[square], kingSqr, boardPos);
            }


            if (type === 'k') {
                if (check.kingPos && check.attackingPiece) {
                    //temporarily removing the attacked king from the board
                    boardPos[check.kingPos] = '';
                }
                for (let i = 0; i < moves.length; i++) {
                    if (isProtected(moves[i], check.kingCol === 'w' ? 'b' : 'w', boardPos)){
                        moves[i] = '';
                    }
                }
                if (check.kingPos && check.kingCol) {
                    //adding back the king to the board
                    boardPos[check.kingPos] = `k-${check.kingCol}`
                }
            }

            if (type !== 'k') {
                let moves2 = kingBetweenMove(check);
                for (let i = 0; i < moves.length; i++) {
                    let valid = false;
                    for (let j = 0; j < moves2.length; j++) {
                        if (moves[i] === moves2[j]) {
                            valid = true;
                        }
                    }
                    if (!valid) {
                        moves[i] = '';
                    }
                }
            }
            moves.forEach((m)=>{
                if(m){
                    legalMoves.push(m);
                }
            })
            if(legalMoves.length>0){
                return false;
            }
        }
    }
    if(legalMoves.length===0){
        return true;
    }
}

module.exports = checkMateDetection;