const express = require('express');
const jwt=require('jsonwebtoken');
const router = express.Router();
const {createToken}=require('../controllers/token/token');

router.post('/checkEmail', (req, res) => {

})


router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const playerCollection = req.db.collection('players');

    const player = { email, password, username };

    playerCollection.insertOne(player)
    .then(async(result) => {
        const payload={
            id:result._id,
            username,
        }
        const token=await createToken(payload);
        res.status(201).json({
            token,
        });
    })
    .catch(err => {
        res.status(500).end();
    })
})

router.post('/login', (req, res) => {
    const password=req.body.password;
    const baseCond=req.body.username ?req.body.username: req.body.email;
    if(baseCond){
        req.db.collection('players').findOne({$or:[{username:baseCond},{email:baseCond}]}).then(async(result)=>{
            if(!result){
                res.status(404).end();
                return;
            }
            if(password===result.password){
                const payload={
                    id:result._id,
                    username:result.username,
                }
                const token=await createToken(payload);
                res.status(201).json({
                    token,
                });
            }
            else{
                res.status(401).end();
                return;
            }
        })
    }
})




module.exports = router;