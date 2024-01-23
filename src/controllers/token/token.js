const jwt=require('jsonwebtoken');

const createToken=(payload)=>{
    const signature=process.env.SECRET_KEY;
    return  jwt.sign(payload,signature);
}

//middleware
const verifyTokenSocket=async(con,req,next)=>{
    const token=req.rawHeaders[21].split(':')[1];
    if(!token){
        console.log(token);
        await con.close();
       return ;
    }
    try{
        const decoded=await jwt.verify(token,process.env.SECRET_KEY);
        req.userId=decoded.id;
        next();
    }
    catch(e){
         con.close();
         return;
    }
}

const verifyToken=async(req,res,next)=>{
    const token=req.headers['authorization'].split(' ')[1];
    if(!token){
        res.status(404).end();
       return ;
    }
    try{
        const decoded=await jwt.verify(token,process.env.SECRET_KEY);
        req.userId=decoded.id;
        next();
    }
    catch(e){
        res.status(500).end();
         return;
    }
}




module.exports={
    createToken,
    verifyToken,
    verifyTokenSocket
}