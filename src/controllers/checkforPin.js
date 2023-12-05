module.exports=function checkforPin(start,piece,kingSqr,boardPos){
      
    const col=piece.split('-')[1];


    for(let key in boardPos){
      if(boardPos[key].split('-')[1]!==col){
        const moves=[];
        let othCond=true;
        if(boardPos[key].split('-')[0]==='q'){

          let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
          let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);

          //move like the bishop
          if(rankDiff===fileDiff || rankDiff===fileDiff*-1){
            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
  
            let temp=key;
  
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
              if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                othCond=false;
              }
              moves.push(temp);
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
                let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
                let rank=temp.split('')[1];
                let sqr=file+rank;
                temp=sqr;
                if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                  othCond=false;
                }
                moves.push(temp);
              }
            }
            else if(fileDiff===0){
              let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
              let temp=key;
              while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
                let file=temp.split('')[0];
                let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
                let sqr=file+rank;
                temp=sqr;
                if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                  othCond=false;
                }
                moves.push(temp);
              }
            }
          }
        }
        else if(boardPos[key].split('-')[0]==='b'){
            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
  
            let temp=key;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp) ){
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
              if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                othCond=false;
              }
              moves.push(temp);
            }
        }
        else if(boardPos[key].split('-')[0]==='r'){

          let rankDiff=parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]);
          let fileDiff=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0);

          if(rankDiff===0){
            let fileIncr=kingSqr.split('')[0].charCodeAt(0)-key.split('')[0].charCodeAt(0)>0?1:-1;
            let temp=start;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp)){
              let file=String.fromCharCode(temp.split('')[0].charCodeAt(0)+fileIncr);
              let rank=temp.split('')[1];
              let sqr=file+rank;
              temp=sqr;
              if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                othCond=false;
              }
              moves.push(temp);
            }
          }
          else if(fileDiff===0){
            let rankIncr=(parseInt(kingSqr.split('')[1])-parseInt(key.split('')[1]))>0?1:-1;
            let temp=key;
            while(temp!==kingSqr && Object.hasOwn(boardPos,temp)){
              let file=temp.split('')[0];
              let rank=(parseInt(temp.split('')[1])+rankIncr).toString();
              let sqr=file+rank;
              temp=sqr;
              if(temp!==start && temp!==kingSqr && boardPos[temp]!=''){
                othCond=false;
              }
              moves.push(temp);
            }
          }
        }

  
        if(moves.indexOf(start)>-1 && othCond){
          return true;
        }

      }
    }
    return false;
}