const getMoves=require('./getMoves');
const checkDetection=require('./checkDetection');
const kingBetweenMove=require('./kingBetweenMove');
const isProtected=require('./isProtected');
const checkCastling=require('./checkCastling');
const checkforPin=require('./checkforPin');
const checkMateDetection=require('./checkMateDetection');

const validateMove=(start, end, piece,{players,currentPlayer,boardPos,check,canShortCastle,canLongCastle,checkMate})=>{


    let isPinned=false;

    if(piece.split('-')[1]===currentPlayer){
        const type = piece.split("-")[0];
        if(type!=='k' && check.kingPos && check.attackingPiece && check.attackingPiece.length>1){
          return;
        }
        let moves=[];
        switch (type) {
          case "p": {
            moves=getMoves.pawn(start,piece,boardPos);
            break;
          }
          case "kn": {
            moves=getMoves.knight(start,piece,boardPos);
            break;
          }
        
          case "q": {
            moves=getMoves.queen(start,piece,boardPos);
            break;
          }
          case "b": {
            moves=getMoves.bishop(start,piece,boardPos);
            break;
          }
          case "r": {
            moves=getMoves.rook(start,piece,boardPos);
            break;
          }
          case 'k':{
            moves=getMoves.king(start,piece,boardPos);
          }
        }
        

        if(type!=='k'){
            let kingSqr='';
            for(let key in boardPos){
              if(boardPos[key]===`k-${piece.split('-')[1]}`){
                kingSqr=key;
              }
            }
            if(kingSqr){
              isPinned=checkforPin(start,piece,kingSqr,boardPos);
            }
        }

        //addition condition for king movement
        if(type==='k'){
          if(check.kingPos && check.attackingPiece){
            //temporarily removing the attacked king from the board
            boardPos[check.kingPos]='';
          }
          for(let i=0;i<moves.length;i++){
            if(isProtected(moves[i],piece.split('-')[1]==='w'?'b':'w',boardPos)){
                moves[i]='';
            }
          }
          if(check.kingPos && check.kingCol){
            //adding back the king to the board
            boardPos[check.kingPos]=`k-${check.kingCol}`
          }
        }

        //check for castling
        if(type=='k' && !check.kingPos ){
          if(piece.split('-')[1]==='w' && boardPos['e1']==='k-w' && (end==='c1' || end==='g1')){
            return checkCastling(end,piece,boardPos,canShortCastle,canLongCastle);
          }
          if(piece.split('-')[1]==='b' && boardPos['e8']==='k-b' && (end==='c8' || end==='g8')){
            return checkCastling(end,piece,boardPos,canShortCastle,canLongCastle);
          }
        }

        //find legal moves during check 
        if(check.kingPos){
          if(type!=='k'){
            let moves2=kingBetweenMove(check);
            for(let i=0;i<moves.length;i++){
              let valid=false;
              for(let j=0;j<moves2.length;j++){
                if(moves[i]===moves2[j]){
                  valid=true;
                } 
              }
              if(!valid){
                  moves[i]='';
              }
            }
          }
        }

        //after all the above condition, if this condition prevails true then the piece can legally move
        if(moves.indexOf(end)>-1 && boardPos[end].split('-')[1]!==piece.split('-')[1] && !isPinned){
          if(type==='k'){
            //the king has successfully moved so set castle for that color king to false
    
            canLongCastle=canLongCastle.filter((e)=>{
              return e!==piece.split('-')[1];
            })
        
            canShortCastle=canShortCastle.filter((e)=>{
              return e!==piece.split('-')[1];
            })
          }
          if(type==='r'){
            //rook has successfully moved so set castle for that color king to false
            if(start==='h1' || start==='h8'){
         
              canShortCastle=canShortCastle.filter((e)=>{
                return e!==piece.split('-')[1];
              })
            }
            else if(start==='a1' || start==='a8'){

              canLongCastle=canLongCastle.filter((e)=>{
                return e!==piece.split('-')[1];
              })
            }
          }

          //check for queening
          if(type==='p'){
            if((piece.split('-')[1]==='w' && parseInt(end.split('')[1])===8) || (piece.split('-')[1]==='b' && parseInt(end.split('')[1])===1)){
                
            }
            
          }

          boardPos[end]=boardPos[start];
          boardPos[start]='';
        

          for(let key in players){
            players[key]['turn']=!players[key]['turn'];
          }

          checkDetection(start,end,piece,check,boardPos);

          if(check.kingPos && check.kingCol){
            if(checkMateDetection(check,boardPos)){
              console.log('checkmate');
              checkMate.status=true;
            }
          }
   
          return true;
        }
        else{
          return false;
        }
     }
     else{
        return false;
     }
  }

module.exports=validateMove;