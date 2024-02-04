const jwt=require('jsonwebtoken');

const createToken=(payload)=>{
    const signature=process.env.SECRET_KEY;
    return  jwt.sign(payload,signature,{expiresIn:"1h"});
}

//middleware
const verifyTokenSocket=async(con,req,next)=>{
    const token=req.rawHeaders[21].split(':')[1];
    if(!token){
        
        const data={
            event:"invalid-token",
        }

        con.send(JSON.stringify(data));
       return ;
    }
    try{
        const decoded= jwt.verify(token,process.env.SECRET_KEY);
        req.userId=decoded.id;
        req.username=decoded.username;

        const data={
            event:"valid-token",
            message:JSON.stringify({
                username:decoded.username,
            })
        }
        con.send(JSON.stringify(data));
        next();
    }
    catch(e){
        const data={
            event:"invalid-token",
        }
         con.send(JSON.stringify(data));
         return;
    }
}

const verifyToken=async(req,res,next)=>{
    const token=req.headers['authorization'].split(' ')[1];
    if(!token){
       return res.status(401).end();
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,decodedValue)=>{
    if(err){
        return res.status(403).end();
    }
    req.username=decodedValue.username;
    next();
    });
}




module.exports={
    createToken,
    verifyToken,
    verifyTokenSocket
}