const storeGame=async(gameCollection,gameState)=>{
    gameCollection.insertOne(gameState).catch((e)=>{
        console.log('something event wrong while storing the game state');
    })
}
module.exports=storeGame;