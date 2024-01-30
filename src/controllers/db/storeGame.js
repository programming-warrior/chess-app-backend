const storeGame=async(gameCollection,gameState)=>{
    console.log(gameState);
    console.log(gameCollection);
    gameCollection.insertOne(gameState).catch((e)=>{
        console.log(e);
        console.log('something event wrong while storing the game state');
    })
}
module.exports=storeGame;