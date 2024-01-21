module.exports=function kingBetweenMove(check){
    const moves=[];

    if(check.kingPos){
        const kingPos=check.kingPos;
        const attackingPos=check.attackingPos;
        for(let i=0;i<attackingPos.length;i++){
          const attackingPiece=check.attackingPiece[i].split('-')[0];
          if(attackingPiece==='b'){
            let rankIncr=(parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]))>0?1:-1;
            let fileIncr=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0)>0?1:-1;
  
            let temp=attackingPos[i];
            
            while(temp!=kingPos){
              moves.push(temp);
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
            }
          }
          else if(attackingPiece==='p'){
            moves.push(attackingPos[i]);
          }
          else if(attackingPiece==='r'){
            let rankDiff=parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]);
            let fileDiff=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0);
  
            if(rankDiff===0){
              let fileIncr=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0)>0?1:-1;
              let temp=attackingPos[i];
              while(temp!=kingPos){
                moves.push(temp);
                let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
                let rank=temp.split('')[1];
                let sqr=file+rank;
                temp=sqr;
              }
            }
            else if(fileDiff===0){
              let rankIncr=(parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]))>0?1:-1;
              let temp=attackingPos[i];
              while(temp!=kingPos){
                moves.push(temp);
                let file=temp.split('')[0];
                let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
                let sqr=file+rank;
                temp=sqr;
              }
            }
  
          }
          else if(attackingPiece==='kn'){
            moves.push(check.attackingPos[i]);
          }
          else if(attackingPiece==='q'){
            let rankDiff=parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]);
            let fileDiff=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0);

            //move like the bishop
            if(rankDiff===fileDiff || rankDiff===fileDiff*-1){
              let rankIncr=(parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]))>0?1:-1;
              let fileIncr=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0)>0?1:-1;
    
              let temp=attackingPos[i];
    
              while(temp!=kingPos){
                moves.push(temp);
                let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
                let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
                let sqr=file+rank;
                temp=sqr;
              }
            }
            //move like the rook
            else{
              let rankDiff=parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]);
              let fileDiff=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0);
    
              if(rankDiff===0){
                let fileIncr=kingPos.split('')[0].charCodeAt(0)-attackingPos[i].split('')[0].charCodeAt(0)>0?1:-1;
                let temp=attackingPos[i];
                while(temp!=kingPos){
                  moves.push(temp);
                  let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
                  let rank=temp.split('')[1];
                  let sqr=file+rank;
                  temp=sqr;
                }
              }
              else if(fileDiff===0){
                let rankIncr=(parseInt(kingPos.split('')[1])-parseInt(attackingPos[i].split('')[1]))>0?1:-1;
                let temp=attackingPos[i];
                while(temp!=kingPos){
                  moves.push(temp);
                  let file=temp.split('')[0];
                  let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
                  let sqr=file+rank;
                  temp=sqr;
                }
              }
            }
          }
        }
          
       
    }
    return moves;
  }