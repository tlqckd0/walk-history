const express = require('express');
const CoordsService = require('./coords.service');

const userInfo = {
    1: 'user1',
    2: 'user2',
};
const router = express.Router();

router.get('/:username', (req, res) => {});

router.post('/', async (req, res, next) => {
    /**
     * {username:
     * code:
     *  record:{err,time,latitude,longitude}}
     */
    const { username, code, record } = req.body;
    if (userInfo[code] !== username) {
        return next(new Error('authentication Error'));
    }
    const result = await CoordsService.saveRecord({ code, record });

    //Redis에 저장
    res.status(201).json({
        success: result,
    });
});

router.post('/finish', async (req, res,next ) => {
    const { username, code } = req.body;
    if (userInfo[code] !== username) {
        return next(new Error('authentication Error'));
    }
    console.log('finish');
    const result = await CoordsService.finishRecording({code});
    //Redis에 저장된거 다 불러오고
    //삭제후 DB에 저장
    res.status(201).json({
        success: result,
    });
});
module.exports = router;
