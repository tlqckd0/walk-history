const express = require('express');
const router = express.Router();

module.exports = async ({db})=>{
    router.post('/login',async (req,res,next)=>{
        const dto = req.body;
        console.log(dto);
        res.send('login');
    })

    router.post('/logout',async(req,res,next)=>{

    })
    
    router.get('/check',async(req,res,next)=>{

    })




    return router;
}