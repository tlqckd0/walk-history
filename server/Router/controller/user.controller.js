const express = require('express');
const router = express.Router();
const wrap = require('../../util/wrap');
const { verifyToken,createToken } = require('../../util/auth');
//자기 정보 확인
router.get(
    '/',
    verifyToken,
    wrap(async (req, res, next) => {})
);

//회원가입
router.post(
    '/',
    wrap(async (req, res, next) => {
        const {user_id,user_name, user_pw} = req.body;

    })
);

//로그인
router.post(
    '/login',
    wrap(async (req, res, next) => {
        const {user_id, user_pw}= req.body;
        const token = await createToken({user_id, user_pw});
        return token;
    })
);

module.exports = router;
