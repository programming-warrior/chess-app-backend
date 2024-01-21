const express = require('express');
const router = express.Router();
const playerSchema = require('../models/playerSchema');


router.post('/checkEmail', (req, res) => {

})

router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const playerCollection = req.db.collection('players');

    const player = { email, password, username };

    playerCollection.insertOne(player)
    .then((result) => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500);
        res.end();
    })
})

router.post('/login', (req, res) => {
    const password=req.body.password;
    const baseCond=req.body.username ?req.body.username: req.body.email;
    console.log(baseCond);
    if(baseCond){
        req.db.collection('players').findOne({$or:[{username:baseCond},{email:baseCond}]}).then((result)=>{
            if(!result){
                res.status(404).end();
                return;
            }
            if(password===result.password){
                res.status(201).json(result);
            }
            else{
                res.status(401).end();
                return;
            }
        })
    }
})




module.exports = router;