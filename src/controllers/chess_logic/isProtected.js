const getMoves=require('./getMoves');

module.exports=function isProtected(square,pieceCol,boardPos){
    for(let key in boardPos){
      if(boardPos[key].split('-')[1]===pieceCol){
          let moves=[];

          let type=boardPos[key].split('-')[0];
          if(type==='kn'){
              moves=getMoves.knight(key,boardPos[key],boardPos);
          }
          else if(type==='b'){
            moves=getMoves.bishop(key,boardPos[key],boardPos);
          }
          else if(type==='r'){
            moves=getMoves.rook(key,boardPos[key],boardPos);
          }
          else if(type==='p'){
            moves=getMoves.pawn2(key,boardPos[key],boardPos);
          }
          else if(type==='q'){
            moves=getMoves.queen(key,boardPos[key],boardPos);
          }
          else if(type==='k'){
            moves=getMoves.king(key,boardPos[key],boardPos);
          }
          
          if(moves.indexOf(square)>-1){
            return true;
          } 
      }
    }
    return false
}