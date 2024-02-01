const getProtectedSquares={};

getProtectedSquares.pawn=  (start,piece,boardPos)=>{
    const moves=[];
    let rankIncr = piece.split('-')[1]==='b'?-1:1;

    let take1='';
    if(start.split('')[0]!='a'){
      take1=String.fromCharCode((start.split('')[0]).charCodeAt(0)-1)+(parseInt(start.split('')[1])+rankIncr).toString()
    }
    let take2='';
    if(start.split('')[0]!='h'){
      take2=String.fromCharCode((start.split('')[0]).charCodeAt(0)+1)+(parseInt(start.split('')[1])+rankIncr).toString();
    }

    if(take1!=='' ){
      moves.push(take1);
    }
    if(take2!=='' ){
      moves.push(take2);
    }
    return moves;
}

getProtectedSquares.rook=(start,piece,boardPos)=>{
    const moves=[];
    let temp='';
    //upward
    temp=start.split('')[0]+(parseInt(start.split('')[1])+1).toString();
    while(boardPos.hasOwnProperty(temp) && boardPos[temp]===''){
      moves.push(temp);
      temp=temp.split('')[0]+(parseInt(temp.split('')[1])+1).toString();
    }
    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //downward
    temp=start.split('')[0]+(parseInt(start.split('')[1])-1).toString();
    while(boardPos.hasOwnProperty(temp) && boardPos[temp]===''){
      moves.push(temp);
      temp=temp.split('')[0]+(parseInt(temp.split('')[1])-1).toString();
    }
    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //leftward
    temp=String.fromCharCode(start.split('')[0].charCodeAt(0)-1)+start.split('')[1];
    while(boardPos.hasOwnProperty(temp) && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)-1)+temp.split('')[1];
    }
    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //rightward
    temp=String.fromCharCode(start.split('')[0].charCodeAt(0)+1)+start.split('')[1];
    while(boardPos.hasOwnProperty(temp) && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)+1)+temp.split('')[1];
    }
    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    return moves;
}


getProtectedSquares.bishop=(start,piece,boardPos)=>{
    const moves=[];
    //upward left
    let temp=String.fromCharCode(start.split('')[0].charCodeAt(0)-1)+(parseInt(start.split('')[1])+1).toString();
    while(boardPos.hasOwnProperty(temp)  && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)-1)+(parseInt(temp.split('')[1])+1).toString();
    }
    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //upward right
    temp=String.fromCharCode(start.split('')[0].charCodeAt(0)+1)+(parseInt(start.split('')[1])+1).toString();
    while(boardPos.hasOwnProperty(temp)  && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)+1)+(parseInt(temp.split('')[1])+1).toString();
    }

    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //downward left
    temp=String.fromCharCode(start.split('')[0].charCodeAt(0)-1)+(parseInt(start.split('')[1])-1).toString();
    while(boardPos.hasOwnProperty(temp)  && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)-1)+(parseInt(temp.split('')[1])-1).toString();
    }

    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }

    //downward right
    temp=String.fromCharCode(start.split('')[0].charCodeAt(0)+1)+(parseInt(start.split('')[1])-1).toString();
    while(boardPos.hasOwnProperty(temp)  && boardPos[temp]===''){
      moves.push(temp);
      temp=String.fromCharCode(temp.split('')[0].charCodeAt(0)+1)+(parseInt(temp.split('')[1])-1).toString();
    }

    if(boardPos.hasOwnProperty(temp) && boardPos[temp].split('-')[1] ===piece.split('-')[1]){
      moves.push(temp);
    }
    return moves;
}

getProtectedSquares.queen=(start,piece,boardPos)=>{
    const moves1=getProtectedSquares.bishop(start,piece,boardPos);
    const moves2=getProtectedSquares.rook(start,piece,boardPos);
    const moves=[...moves1,...moves2];
    return moves;
}

getProtectedSquares.knight=(start,piece,boardPos)=>{
    const moves=[];
    //left upward
    let move=String.fromCharCode(start.split('')[0].charCodeAt(0)-2)+(parseInt(start.split('')[1])+1).toString();
    if(Object.hasOwn(boardPos,move) &&(boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //right upward
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)+2)+(parseInt(start.split('')[1])+1).toString();
    if(Object.hasOwn(boardPos,move) &&(boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //left downward
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)-2)+(parseInt(start.split('')[1])-1).toString();
    if(Object.hasOwn(boardPos,move) && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //right downward
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)+2)+(parseInt(start.split('')[1])-1).toString();
    if(Object.hasOwn(boardPos,move) && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //upward left
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)-1)+(parseInt(start.split('')[1])+2).toString();
    if(Object.hasOwn(boardPos,move)  && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //upward right
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)+1)+(parseInt(start.split('')[1])+2).toString();
    if(Object.hasOwn(boardPos,move) && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //downward left
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)-1)+(parseInt(start.split('')[1])-2).toString();
    if(Object.hasOwn(boardPos,move) && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    //downward right
    move=String.fromCharCode(start.split('')[0].charCodeAt(0)+1)+(parseInt(start.split('')[1])-2).toString();
    if(Object.hasOwn(boardPos,move) && (boardPos[move].split('-')[1]===piece.split('-')[1] || boardPos[move]==='')){
      moves.push(move);
    }

    return moves;
}

getProtectedSquares.king=(start,piece,boardPos)=>{
    let moves=[];
    let file=start.split('')[0];
    let rank=start.split('')[1];

    let square='';

    //upward right

    square=String.fromCharCode(file.charCodeAt(0)+1)+(parseInt(rank)+1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]!==piece.split('-')[1])){
      moves.push(square);
    }

    //upward left
  
    square=String.fromCharCode(file.charCodeAt(0)-1)+(parseInt(rank)+1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    //downward right
    square=String.fromCharCode(file.charCodeAt(0)+1)+(parseInt(rank)-1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    //downward left
    square=String.fromCharCode(file.charCodeAt(0)-1)+(parseInt(rank)-1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    //up
    square=String.fromCharCode(file.charCodeAt(0))+(parseInt(rank)+1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    //down
    square=String.fromCharCode(file.charCodeAt(0))+(parseInt(rank)-1).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }


    //left
    square=String.fromCharCode(file.charCodeAt(0)-1)+(parseInt(rank)).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    //right
    square=String.fromCharCode(file.charCodeAt(0)+1)+(parseInt(rank)).toString();

    if(Object.hasOwn(boardPos,square) && (boardPos[square]==='' || boardPos[square].split('-')[1]===piece.split('-')[1])){
      moves.push(square);
    }

    return moves;
}

module.exports=getProtectedSquares;