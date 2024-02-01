

function startClock(connections,room){
    console.log('start clock function called');
    const clientIds=Object.keys(room['players']);
    const interval=setInterval(()=>{
        let data;
        clientIds.forEach((clientId)=>{

            if(room['currentPlayer']===room['players'][clientId]['col'] && room['players'][clientId]['time']>0  ){
                room['players'][clientId]['time']-=(100);
                 data={
                    event:"tick",
                    message:{
                       player: room['players'][clientId]['col'],
                       time:room['players'][clientId]['time'],
                    }
                }
            }
            if(room['players'][clientId]['time']===0){

                data['event']='time-out';
                data['message']['winner']=room['players'][clientId]['col']==='w'?'b':'w';
                clearInterval(interval);
                connections[clientIds[0]]?.send(JSON.stringify(data));
                connections[clientIds[1]]?.send(JSON.stringify(data));
                return;
            }
        })
        room['clock']=interval;
        connections[clientIds[0]]?.send(JSON.stringify(data));
        connections[clientIds[1]]?.send(JSON.stringify(data));
    },1000)
}

function stopClock(room){
    if(room['clock']){
        console.log('stopclock function called');
        clearInterval(room['clock']);
    }
}

module.exports={
    startClock,
    stopClock
}
