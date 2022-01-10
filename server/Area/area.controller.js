const express = require('express');
const router = express.Router();
const areaService = require('./area.service');

router.get('/:bottom/:top/:left/:right', async(req, res, next) => {
    const { bottom, top, left, right } = req.params;
    try {
        //해당 지역 전부 가지고오기.
        const result = await areaService.findArea({
            username: null,
            bottom : bottom * 1,
            top : top * 1,
            left : left * 1,
            right : right * 1,
        });
        res.send({
            success: true,
            result,
        });
    } catch (err) {
        next(err);
    }
});


router.get('/:username/:bottom/:top/:left/:right',async (req, res, next) => {
    const { username, bottom, top, left, right } = req.params;
    try {
        //해당 지역 유저데이터 가지고오기.
        const result = await areaService.findArea({
            username,
            bottom : bottom * 1,
            top : top * 1,
            left : left * 1,
            right : right * 1,
        });
        res.send({
            success: true,
            result,
        });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
