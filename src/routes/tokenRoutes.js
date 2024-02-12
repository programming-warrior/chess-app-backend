const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createToken } = require('../controllers/token/token');
const cookieParser=require('cookie-parser');

router.post('/token',(req, res) => {
    
    const refreshToken=req.body.refreshToken;
    if(!refreshToken) return res.status(403).end();    

    const refreshTokenCollection = req.db.collection('refreshTokens');

    refreshTokenCollection.findOne({ token: refreshToken }).then((result) => {
        if (!result || !result.token) return res.status(403).end();
        jwt.verify(result.token, process.env.REFRESH_TOKEN, (err, decodedValue) => {

            if (err) return res.status(403).end();

            const accessToken = createToken({ username: decodedValue.username });

            return res.status(200).json({
                username: decodedValue.username,
                accessToken,
            });

        })

    })
})

module.exports = router;


