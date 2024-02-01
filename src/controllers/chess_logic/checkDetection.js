
const getMoves = require('./getMoves');

//algorithm
//first find if any check because of the movement of the piece.
//regardless whethere piece movement has caused check or not
//we would remove that piece from the board to check for any discover check from bishop, rook, or queen

function pawnCheckDetect(start, end, piece, check, boardPos) {
  6
  const col = piece.split("-")[1];
  const type = piece.split("-")[0];
  let kingCol = "";
  let kingPos = "";
  let attackingPos = [];
  let attackingPiece = [];


  if (!check.kingPos) {
    const rankIncr = col === "w" ? 1 : -1;
    const controlledSquare1 =
      String.fromCharCode(end.split("")[0].charCodeAt(0) + 1) + (parseInt(end.split("")[1]) + rankIncr).toString();
    const controlledSquare2 = String.fromCharCode(end.split("")[0].charCodeAt(0) - 1) + (parseInt(end.split("")[1]) + rankIncr).toString();

    if (boardPos[controlledSquare1] === `k-${col === "w" ? "b" : "w"}`) {
      kingPos = controlledSquare1;
      kingCol = col === "w" ? "b" : "w"
      attackingPos.push(end);
      attackingPiece.push(piece);
    }
    else if (boardPos[controlledSquare2] === `k-${col === "w" ? "b" : "w"}`) {
      kingPos = controlledSquare2;
      kingCol = col === "w" ? "b" : "w"
      attackingPos.push(end);
      attackingPiece.push(piece);
    }

    //now check for any dobule check caused by the rook, bishop, and the queen.
    let moves = [];
    let bishopEnd = '';
    let rookEnd = '';
    let queenEnd = '';
    for (let key in boardPos) {
      if (boardPos[key] === `b-${col}`) {
        bishopEnd = key;
        moves = getMoves.bishop(bishopEnd, boardPos[key], boardPos);
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            attackingPos.push(bishopEnd);;
            attackingPiece.push(`b-${col}`);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";
            break;
          }
        }
      }
      else if (boardPos[key] === `r-${col}`) {
        rookEnd = key;
        moves = getMoves.rook(rookEnd, boardPos[key], boardPos);
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] != '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            attackingPos.push(rookEnd);;
            attackingPiece.push(`r-${col}`);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";
            break;
          }
        }
      }
      else if (boardPos[key] === `q-${col}`) {
        queenEnd = key;
        moves = getMoves.queen(queenEnd, boardPos[key], boardPos);
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            attackingPos.push(queenEnd);;
            attackingPiece.push(`q-${col}`);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";
            break;
          }
        }
      }
    }
    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
  else {
    kingCol = "";
    kingPos = "";
    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
}


function rookCheckDetect(start, end, piece, check, boardPos) {
  const col = piece.split("-")[1];
  const type = piece.split("-")[0];
  let kingCol = "";
  let kingPos = "";
  let attackingPos = [];
  let attackingPiece = [];
  if (!check.kingPos) {
    let moves = getMoves.rook(end, piece, boardPos);
    for (let i = 0; i < moves.length; i++) {
      if (boardPos[moves[i]] != '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
        kingPos = moves[i];
        kingCol = col === "w" ? "b" : "w"
        attackingPos.push(end);
        attackingPiece.push(piece);

        break;
      }
    }
    //now check for any dobule check caused by the bishop, and the queen.
    let bishopEnd = '';
    let queenEnd = '';


    for (let key in boardPos) {
      if (boardPos[key] === `b-${col}`) {
        bishopEnd = key;
        moves = getMoves.bishop(bishopEnd, boardPos[key], boardPos);
        //check for the discover check by the bishop
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w"
            attackingPos.push(bishopEnd);
            attackingPiece.push(`b-${col}`);

            break;
          }
        }
      }

      else if (boardPos[key] === `q-${col}`) {
        queenEnd = key;
        moves = getMoves.queen(queenEnd, boardPos[key], boardPos);
        //check for the check
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w"
            attackingPos.push(queenEnd);
            attackingPiece.push(`q-${col}`);
            break;
          }
        }
      }
    }
    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }

  else {
    kingCol = "";
    kingPos = "";

    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
}

function bishopCheckDetect(start, end, piece, check, boardPos) {
  const col = piece.split("-")[1];
  const type = piece.split("-")[0];

  let kingCol = "";
  let kingPos = "";
  let attackingPos = [];
  let attackingPiece = [];

  if (!check.kingPos) {
    let moves = getMoves.bishop(end, piece, boardPos);
    //check for the check
    for (let i = 0; i < moves.length; i++) {
      if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
        kingPos = moves[i];
        kingCol = col === "w" ? "b" : "w"
        attackingPos.push(end);
        attackingPiece.push(piece);

        break;
      }
    }

    //now check for any dobule check caused by the rook, bishop, and the queen.
    let rookEnd = '';
    let queenEnd = '';
    for (let key in boardPos) {

      if (boardPos[key] === `r-${col}`) {
        rookEnd = key;
        moves = getMoves.rook(rookEnd, boardPos[key], boardPos);
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] != '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w"
            attackingPos.push(rookEnd);;
            attackingPiece.push(`r-${col}`);

            break;
          }
        }
      }
      else if (boardPos[key] === `q-${col}`) {
        queenEnd = key;
        moves = getMoves.queen(queenEnd, boardPos[key], boardPos);
        //check for the check
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w"
            attackingPos.push(queenEnd);;
            attackingPiece.push(`q-${col}`);


            break;
          }
        }
      }
    }
    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }

  else {
    kingCol = "";
    kingPos = "";

    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
}


function queenCheckDetect(start, end, piece, check, boardPos) {
  const col = piece.split("-")[1];
  const type = piece.split("-")[0];
  let kingCol = col === "w" ? "b" : "w";
  let kingPos = "";
  let attackingPos = [];
  let attackingPiece = [];

  attackingPos.push(end);
  attackingPiece.push(piece);



  if (!check.kingPos) {
    const moves = getMoves.queen(end, piece, boardPos);
    for (let i = 0; i < moves.length; i++) {
      if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
        kingPos = moves[i];
        check['kingCol'] = kingCol;
        check['kingPos'] = kingPos;
        check['attackingPiece'] = attackingPiece;
        check['attackingPos'] = attackingPos;
        break;
      }
    }
  }
  else {
    kingCol = "";
    kingPos = "";

    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
}

function knightCheckDetect(start, end, piece, check, boardPos) {
  const col = piece.split("-")[1];
  const type = piece.split("-")[0];
  let kingCol = "";
  let kingPos = "";
  let attackingPos = [];
  let attackingPiece = [];



  if (!check.kingPos) {
    let moves = getMoves.knight(end, piece, boardPos);
    for (let i = 0; i < moves.length; i++) {
      if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
        kingPos = moves[i];
        kingCol = col === "w" ? "b" : "w";
        attackingPos.push(end);
        attackingPiece.push(piece);
        break;
      }
    }

    let bishopEnd = '';
    let rookEnd = '';
    let queenEnd = '';
    for (let key in boardPos) {
      if (boardPos[key] === `b-${col}`) {
        bishopEnd = key;
        moves = getMoves.bishop(bishopEnd, piece, boardPos);
        //check for the discover check by the bishop
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {

            attackingPos.push(bishopEnd);
            attackingPiece.push(`b-${col}`);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";

            break;
          }
        }
      }
      else if (boardPos[key] === `r-${col}`) {
        rookEnd = key;
        moves = getMoves.rook(rookEnd, piece, boardPos);
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] != '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            attackingPiece.push(`r-${col}`);
            attackingPos.push(rookEnd);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";
            break;
          }
        }
      }
      else if (boardPos[key] === `q-${col}`) {
        queenEnd = key;
        moves = getMoves.queen(queenEnd, piece, boardPos);
        //check for the check
        for (let i = 0; i < moves.length; i++) {
          if (boardPos[moves[i]] !== '' && boardPos[moves[i]].split('-')[0] === 'k' && boardPos[moves[i]].split('-')[1] !== piece.split('-')[1]) {
            attackingPiece.push(`q-${col}`);
            attackingPos.push(queenEnd);
            kingPos = moves[i];
            kingCol = col === "w" ? "b" : "w";
            break;
          }
        }
      }
    }
    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
  else {
    kingCol = "";
    kingPos = "";

    check['kingCol'] = kingCol;
    check['kingPos'] = kingPos;
    check['attackingPiece'] = attackingPiece;
    check['attackingPos'] = attackingPos;
  }
}



module.exports = function checkDetection(start, end, piece, check, boardPos) {

  const type = piece.split("-")[0];

  if (type === "p") {
    pawnCheckDetect(start, end, piece, check, boardPos);
  }
  else if (type === "b") {
    bishopCheckDetect(start, end, piece, check, boardPos);
  }
  else if (type === "r") {
    rookCheckDetect(start, end, piece, check, boardPos);
  }

  else if (type === "kn") {
    knightCheckDetect(start, end, piece, check, boardPos);
  }
  else if (type === "q") {
    queenCheckDetect(start, end, piece, check, boardPos);
  }

  //if there is a check and the attacked king has moved then remove the check
  else if (type === 'k') {
    if (check.kingPos && check.kingCol) {
      let kingCol = "";
      let kingPos = "";
      let attackingPiece = [];
      let attackingPos = [];

      check['kingCol'] = kingCol;
      check['kingPos'] = kingPos;
      check['attackingPiece'] = attackingPiece;
      check['attackingPos'] = attackingPos;
    }
  }

}