const jwt=require('jsonwebtoken');


const createRefreshToken=(refreshTokenCollection,payload)=>{
    const refreshToken=jwt.sign(payload,process.env.REFRESH_TOKEN);
    //save the token into the database
    return refreshTokenCollection.insertOne({token:refreshToken}).then((result)=>{
      if(!result) return null;
      return refreshToken
     })
     .catch(e=>{
      return null;
     })
}


module.exports={
    createRefreshToken
}