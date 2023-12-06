module.exports=function checkCastling(moves,end,piece,boardPos,canShortCastle,canLongCastle){
    
    let col=piece.split('-')[1];
    if(col==='w' && (boardPos['h1']===`r-${col}`|| boardPos['a1']===`r-${col}`) && boardPos['e1']===`k-${col}` ){
      if(end==='g1' && canShortCastle.indexOf(col)>-1){
        if(moves.indexOf('f1')>-1 && !isProtected('g1','b')){
          castle('e1','g1','h1','f1',col);
        }
      }
      else if(end==='c1' && canLongCastle.indexOf(col)>-1){
        if(moves.indexOf('d1')>-1 && !isProtected('c1','b')){
          castle('e1','c1','a1','d1',col);
        }
      }
    }
    else if(col==='b' && (boardPos['h8']===`r-${col}`|| boardPos['a8']===`r-${col}`) && boardPos['e8']===`k-${col}`){
      if(end==='g8' && canShortCastle.indexOf(col)>-1){
        if(moves.indexOf('f8')>-1 && !isProtected('g8','w')){
          castle('e8','g8','h8','f8',col);
        }
      }
      else if(end==='c8' && canLongCastle.indexOf(col)>-1){
        if(moves.indexOf('d8')>-1 && !isProtected('c8','w')){
          //king will move from e8 to c8 and the rook will move from a8 to d8
          castle('e8','c8','a8','d8',col);
        }
      }
    }
   
}