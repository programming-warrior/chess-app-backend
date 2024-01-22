const jwt=require('jsonwebtoken');

const createToken=async(payload)=>{
    const signature=process.env.SECRET_KEY;
    const token=await jwt.sign(payload,SECRET_KEY);
    return token;
}

module.exports={
    createToken,
}