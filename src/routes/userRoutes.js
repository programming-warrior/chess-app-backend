const express = require('express');
const jwt=require('jsonwebtoken');
const router = express.Router();
const {createToken}=require('../controllers/token/token');
const {createRefreshToken}=require('../controllers/token/refreshToken');
const { MongoError } = require('mongodb');
const {hashPassword,compareHashedPassword}=require('../controllers/hashPassword')

router.post('/checkUsername', (req, res) => {
    let username=req.body.username;
    username=username && typeof(username)==='string'?username.trim():null;
    if(!username) return res.status(401).json({status:"invalid",message:""}); 
    //check for username validity
    if(username.length>80) return res.status(401).json({status:"invalid",message:"username length should not exceed 80"});
    if(username.length<5) return res.status(401).json({status:"invalid",message:"length should be atleast 5"});
    const specialChars='$ % ^ & * ( ) ! @ # } { [ ] | ; : \' \" \\ , + = / ? < > ` ~'.split(' ');
    specialChars.forEach((ch)=>{
        if(username.includes(ch)) return res.status(401).json({status:"invalid",message:"special char not allowed except[. - _]"});
    })
    //check for username existence
    req.db.collection('players').findOne({username:username}).then((result)=>{
        if(result){
            return res.status(401).json({status:"invalid",message:"username doesn't exist"});
        }
        return res.status(200).json({status:"valid",message:"username exists"});
    })
    .catch((e)=>{
        return res.status(500).json({status:"invalid",message:"username doesn't exist"});
    })
})


router.post('/register', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const playerCollection = req.db.collection('players');
    const encryptedPassword=await hashPassword(password,10);
    if(!encryptedPassword)return res.status(500).end();

    const player = { email, password:encryptedPassword, username };

    playerCollection.insertOne(player)
    .then(async(result) => {
  
        const payload={
            username,
        }
        const accessToken= createToken(payload);
        const refreshToken=await createRefreshToken(req.db.collection('refreshTokens'),payload);
        if(!accessToken || !refreshToken) return res.status(301).end(); 

        res.status(201).json({
            username:result.username,
            refreshToken,
            accessToken,
        });
    })
    .catch(err => {
        if(err instanceof MongoError) res.status(500).end();
         return res.status(301).end();
    })
})

router.post('/login',async (req, res) => {
    const password=req.body.password;
    const username=req.body.username;
    if(username && password){
        req.db.collection('players').findOne({username:username})
        .then(async(result)=>{
           if(!result) return res.status(401).end();
            if(await compareHashedPassword(password,result.password)){
                const payload={
                    username:result.username,
                }
                const accessToken= createToken(payload);
                const refreshToken= await createRefreshToken(req.db.collection('refreshTokens'),payload);
     
                if(!accessToken || !refreshToken) return res.status(301).end(); 
                res.status(201).json({
                    username:result.username,
                    refreshToken,
                    accessToken,
                })
            }
            else{
                res.status(401).end();
                return;
            }
        })
        .catch((e)=>{
            console.log(e);
            if(e instanceof MongoError) return res.status(500).end();
            return res.status(301).end();
        })
    }
    else{
        res.status(401).end();
    }
})


router.delete('/logout',(req,res)=>{
    const refreshToken=req.body.refreshToken;
    req.db.collection('refreshTokens').deleteOne({token:refreshToken}).then((result)=>{
        if(result.deletedCount<1) return res.status(500).end();
        res.status(201).end(); 
    }).catch((err)=>{
        res.status(500).end();
    })
})



module.exports = router;