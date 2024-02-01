const getProtectedSquares=require('./getProtectedSquares');

module.exports=function isProtected(square,pieceCol,boardPos){
    for(let key in boardPos){
      if(boardPos[key] && boardPos[key].split('-')[1]===pieceCol){
          let moves=[];

          let type=boardPos[key].split('-')[0];
          if(type==='kn'){
              moves=getProtectedSquares.knight(key,boardPos[key],boardPos);
          }
          else if(type==='b'){
            moves=getProtectedSquares.bishop(key,boardPos[key],boardPos);
          }
          else if(type==='r'){
            moves=getProtectedSquares.rook(key,boardPos[key],boardPos);
          }
          else if(type==='p'){
            moves=getProtectedSquares.pawn(key,boardPos[key],boardPos);
          }
          else if(type==='q'){
            moves=getProtectedSquares.queen(key,boardPos[key],boardPos);
          }
          else if(type==='k'){
            moves=getProtectedSquares.king(key,boardPos[key],boardPos);
          }
          
          if(moves.indexOf(square)>-1){
            return true;
          } 
      }
    }
    return false
}