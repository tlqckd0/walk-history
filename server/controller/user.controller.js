const express = require('express');
const router = express.Router();
const wrap = require('../Router/middleware/wrap');
const { verifyToken,createToken } = require('../Router/middleware/auth');
const userService = require('../Service/user.service');
//자기 정보 확인
const finduser = async (req,res,next)=>{
    try{
        const user =await userService.findUserByIdPw(req.body);
        
    }catch(err){
        next(err);
    }
}

c
router.get(
    '/',
    verifyToken,
    wrap(async (req, res, next) => {

    })
);

//회원가입
router.post(
    '/',
    wrap(async (req, res, next) => {
        const {user_id,user_name, user_pw} = req.body;
        

    })
);



module.exports = router;
