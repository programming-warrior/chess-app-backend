const getMoves = require('./getMoves');
const checkDetection = require('./checkDetection');
const kingBetweenMove = require('./kingBetweenMove');
const isProtected = require('./isProtected');
const checkCastling = require('./checkCastling');
const checkforPin = require('./checkforPin');
const checkMateDetection = require('./checkMateDetection');

const validateMove = (start, end, piece, { players, currentPlayer, boardPos, check, canShortCastle, canLongCastle, checkMate, queening}) => {



  if (piece.split('-')[1] === currentPlayer) {
    const type = piece.split("-")[0];
    if (type !== 'k' && check.kingPos && check.attackingPiece && check.attackingPiece.length > 1) {
      return;
    }
    let moves = [];
    switch (type) {
      case "p": {
        moves = getMoves.pawn(start, piece, boardPos);
        break;
      }
      case "kn": {
        moves = getMoves.knight(start, piece, boardPos);
        break;
      }

      case "q": {
        moves = getMoves.queen(start, piece, boardPos);
        break;
      }
      case "b": {
        moves = getMoves.bishop(start, piece, boardPos);
        break;
      }
      case "r": {
        moves = getMoves.rook(start, piece, boardPos);
        break;
      }
      case 'k': {
        moves = getMoves.king(start, piece, boardPos);
      }
    }


    if (type !== 'k') {
      let kingSqr = '';
      for (let key in boardPos) {
        if (boardPos[key] === `k-${piece.split('-')[1]}`) {
          kingSqr = key;
        }
      }
      if (kingSqr) {
        const allowedMoves = checkforPin(start, piece, kingSqr, boardPos);
        console.log("allowedMoves");
        console.log(allowedMoves);
        if (allowedMoves.length > 0) {
          console.log(allowedMoves);
          moves = moves.filter((value) => {
            return allowedMoves.includes(value);
          })
        }
      }
    }

    //addition condition for king movement
    if (type === 'k') {
      if (check.kingPos && check.attackingPiece) {
        //temporarily removing the attacked king from the board
        boardPos[check.kingPos] = '';
      }
      for (let i = 0; i < moves.length; i++) {
        if (isProtected(moves[i], piece.split('-')[1] === 'w' ? 'b' : 'w', boardPos)) {
          moves[i] = '';
        }
      }
      if (check.kingPos && check.kingCol) {
        //adding back the king to the board
        boardPos[check.kingPos] = `k-${check.kingCol}`
      }
    }

    //check for castling
    if (type == 'k' && !check.kingPos) {
      if (piece.split('-')[1] === 'w' && boardPos['e1'] === 'k-w' && (end === 'c1' || end === 'g1')) {
        return checkCastling(end, piece, boardPos, canShortCastle, canLongCastle);
      }
      if (piece.split('-')[1] === 'b' && boardPos['e8'] === 'k-b' && (end === 'c8' || end === 'g8')) {
        return checkCastling(end, piece, boardPos, canShortCastle, canLongCastle);
      }
    }

    //find legal moves during check 
    if (check.kingPos) {
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
    }



    //after all the above condition, if this condition prevails true then the piece can legally move
    if (moves.indexOf(end) > -1 && boardPos[end].split('-')[1] !== piece.split('-')[1]) {
      if (type === 'k') {
        //the king has successfully moved so set castle for that color king to false

        for (let i = 0; i < canLongCastle.length; i++) {
          if (canLongCastle[i] === piece.split('-')[1]) {
            canLongCastle[i] = '';
          }
        }
        for (let i = 0; i < canShortCastle.length; i++) {
          if (canShortCastle[i] === piece.split('-')[1]) {
            canShortCastle[i] = '';
          }
        }

      }
      if (type === 'r') {
        //rook has successfully moved so set castle for that color king to false
        if (start === 'h1' || start === 'h8') {

          for (let i = 0; i < canShortCastle.length; i++) {
            if (canShortCastle[i] === piece.split('-')[1]) {
              canShortCastle[i] = '';
            }
          }
          
        }
        else if (start === 'a1' || start === 'a8') {

          for (let i = 0; i < canLongCastle.length; i++) {
            if (canLongCastle[i] === piece.split('-')[1]) {
              canLongCastle[i] = '';
            }
          }

        }
      }

      //check for queening
      if (type === 'p') {
        if (piece.split('-')[1] === 'w' && parseInt(end.split('')[1]) === 8){
          //white queening
          queening.col='w';
          queening.pawn=end;
        }

        else if(piece.split('-')[1] === 'b' && parseInt(end.split('')[1]) === 1){
          //black queening
          queening.col='b';
          queening.pawn=end;
        }
      }

      boardPos[end] = boardPos[start];
      boardPos[start] = '';


      for (let key in players) {
        players[key]['turn'] = !players[key]['turn'];
      }

      //remove previous checks if any
      check['kingCol'] = '';
      check['kingPos'] = '';
      check['attackingPiece'] = [];
      check['attackingPos'] = [];

      checkDetection(start, end, piece, check, boardPos);

      if (check.kingPos && check.kingCol) {
        if (checkMateDetection(check, boardPos)) {
          console.log('checkmate');
          checkMate.status = true;
        }
      }

      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

module.exports = validateMove;