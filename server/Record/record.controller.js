const express = require('express');
const recordService = require('./record.service');

const router = express.Router();

//해당 유저에 맞는 기록
router.get('/:username', async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await recordService.findUserRecordList({ username });
        res.json({
            success: true,
            result,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/start', async (req, res, next) => {
    const { usercode } = req.body;

    try {
        const data = await recordService.startRecord({ usercode });
        res.status(201).json({
            success: data.success,
            recordcode: data.recordcode,
        });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    /**
     * {username:
     * code:
     *  record:{counter,latitude,longitude}}
     */
    const { usercode, record } = req.body;
    try {
        const result = await recordService.saveRecord({ usercode, record });
        res.status(201).json({ success: result });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

//종료
router.post('/finish', async (req, res, next) => {
    const { finish, usercode, recordcode } = req.body;
    try {
        let success = null;
        let message = '';
        if (finish === 1) {
            //정상적인 종료
            success = await recordService.finishRecording({ usercode, recordcode });
            message = 'finish record';
        } else {
            //종료조건을 못마춤
            success = await recordService.finishWithError({ usercode, recordcode });
            message = 'error process OK';
        }

        res.status(201).json({
            success,
            message,
        });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

//재시작
router.post('/reset', async (req, res, next) => {
    const { usercode } = req.body;
    try {
        const success = await recordService.resetRecord({ usercode });
        res.json({
            success,
        });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

module.exports = router;
