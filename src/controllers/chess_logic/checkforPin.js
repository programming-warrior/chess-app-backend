module.exports=function checkforPin(start,piece,kingSqr,boardPos){
      
    const col=piece.split('-')[1];


    for(let key in boardPos){
      if(boardPos[key].split('-')[1]!==col && (boardPos[key].split('-')[0]==='b' || boardPos[key].split('-')[0]==='q' || boardPos[key].split('-')[0]==='r')){
        const moves=[];
        let otherPieceInBetween=false;
        if(boardPos[key].split('-')[0]==='q'){

          let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
          let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);

          //move like the bishop
          if(rankDiff===fileDiff || rankDiff===fileDiff*-1){
            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
  
            let temp=key;
  
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
              moves.push(temp);
              if(temp!==start && temp!==key && boardPos[temp]!=''){
                otherPieceInBetween=true;
              }
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
         
            }
          }
          //move like the rook
          else{

            let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
            let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);
  
            if(rankDiff===0){
              let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
              let temp=key;
              while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
                moves.push(temp);
                if(temp!==start && temp!==key && boardPos[temp]!=''){
                  otherPieceInBetween=true;
                }
                let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
                let rank=temp.split('')[1];
                let sqr=file+rank;
                temp=sqr;

              }
            }
            else if(fileDiff===0){
              let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
              let temp=key;
              while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
                moves.push(temp);
                if(temp!==start && temp!==key && boardPos[temp]!=''){
                  otherPieceInBetween=true;
                }
                let file=temp.split('')[0];
                let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
                let sqr=file+rank;
                temp=sqr;
             
              }
            }
          }
        }
        else if(boardPos[key].split('-')[0]==='b'){
          let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
          let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);
          if(rankDiff===fileDiff || rankDiff===fileDiff*-1){

            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
  
            let temp=key;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp)){
              moves.push(temp);
              if(temp!==start && temp!==key && boardPos[temp]!=''){
                otherPieceInBetween=true;
              }
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
            }
          }
        }
        else if(boardPos[key].split('-')[0]==='r'){

          let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
          let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);

          if(rankDiff===0){
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
            let temp=start;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp)){
              moves.push(temp);
              if(temp!==start && temp!==key && boardPos[temp]!=''){
                otherPieceInBetween=true;
              }

              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=temp.split('')[1];
              let sqr=file+rank;
              temp=sqr;
          
            }
          }
          else if(fileDiff===0){
            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let temp=key;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp)){
              moves.push(temp);
              if(temp!==start && temp!==key && boardPos[temp]!=''){
                otherPieceInBetween=true;
              }
              let file=temp.split('')[0];
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
            }
          }
        }

     
        if(moves.indexOf(start)>-1 && !otherPieceInBetween){
       
          return moves;
        }

      }
    }
    return [];
}