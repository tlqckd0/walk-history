const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const CustomError = require('../../../Exception/CustomError');

const jwt_secret = process.env.JWT_SECRET;

//로그인 토큰 생성
const createToken = async (req, res, next) => {
    try {
        const { user_id, user_pw } = req.body;

        const user = []; //일단
        if (user.length) {
            const token = jwt.sign(
                { user_id: user[0].user_id, user_name: user[0].user_name },
                jwt_secret,
                {
                    expiresIn: '1h',
                }
            );
            res.cookie('bearer', token);
            res.status(201).json({
                success: true,
                message: 'login success',
            });
        } else {
            next(new Error(400, 'Invalid user.'));
        }
    } catch (err) {
        next(new Error(400, 'Token create error.'));
    }
};

//검증 미들웨어
const verifyToken = async (req, res, next) => {
    try {
        const clientToken = req.cookis.bearer;
        const decode = jwt.decode(clientToken, jwt_secret);
        if (decode) {
            res.locals.id = decode.id;
            next();
        } else {
            next(new CustomError(401, 'User unauthorized.'));
        }
    } catch (err) {
        next(new CustomError(401, 'Token expired.'));
    }
};

module.exports = {
    createToken,
    verifyToken,
};
