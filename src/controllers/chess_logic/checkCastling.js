const isProtected=require('./isProtected');
module.exports=function checkCastling(end,piece,boardPos,canShortCastle,canLongCastle){
    
    let col=piece.split('-')[1];
    if(col==='w' && (boardPos['h1']===`r-${col}`|| boardPos['a1']===`r-${col}`) && boardPos['e1']===`k-${col}` ){
      if(end==='g1' && boardPos['h1']===`r-${col}` && canShortCastle.indexOf(col)>-1){
        if(boardPos['g1']===''  && boardPos['f1']==='' && !isProtected('g1','b',boardPos) && !isProtected('f1','b',boardPos)){
          boardPos['g1']='k-w';
          boardPos['f1']='r-w';
          boardPos['h1']='';
          boardPos['e1']='';
            return true;
        }
      }
      else if(end==='c1' && boardPos['a1']===`r-${col}` && canLongCastle.indexOf(col)>-1){
        if( boardPos['c1']===''  && boardPos['b1']==='' && boardPos['d1']==='' && !isProtected('c1','b',boardPos) && !isProtected('d1','b',boardPos) ){
          boardPos['c1']='k-w';
          boardPos['d1']='r-w';
          boardPos['a1']='';
          boardPos['e1']='';
          return true;
        }
      }
    }
    else if(col==='b' && (boardPos['h8']===`r-${col}`|| boardPos['a8']===`r-${col}`) && boardPos['e8']===`k-${col}`){
      if(end==='g8' && boardPos['h8']===`r-${col}` && canShortCastle.indexOf(col)>-1){
        if( boardPos['g8']===''&& boardPos['f8']==='' && !isProtected('g8','w',boardPos) && !isProtected('f8','w',boardPos)){
          boardPos['g8']='k-b';
          boardPos['f8']='r-b';
          boardPos['e8']='';
          boardPos['h8']='';
          return true;
        }
      }
      else if(end==='c8' && boardPos['a8']===`r-${col}` && canLongCastle.indexOf(col)>-1){
        if(boardPos['c8']==='' && boardPos['b8']==='' && boardPos['d8']==='' && !isProtected('c8','w',boardPos) && !isProtected('d8','w',boardPos)){
          //king will move from e8 to c8 and the rook will move from a8 to d8
          boardPos['c8']='k-b';
          boardPos['d8']='r-b';
          boardPos['e8']='';
          boardPos['a8']=''
          return true;
        }
      }
    }


    return false;
   
}