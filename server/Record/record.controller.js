const express = require('express');
const {
    startRecord,
    saveRecord,
    finishRecording,
    finishWithError,
    resetRecord
} = require('./record.service');

const router = express.Router();

router.get('/:usercode/:recordCode', (req, res) => {});

router.post('/start', async (req, res, next) => {
    const { usercode, username } = req.body;

    try {
        const data = await startRecord({ usercode, username });
        res.status(201).json({
            success: data.success,
            recordcode: data.recordcode,
        });
    } catch (err) {
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
        const result = await saveRecord({ usercode, record });
        res.status(201).json({ success: result });
    } catch (err) {
        next(err);
    }
});

//종료
router.post('/finish', async (req, res, next) => {
    const { err, usercode, recordcode } = req.body;
    try {
        let success = null;
        let message = '';

        if (err) {
            success = await finishWithError({ usercode, recordcode });
            message = 'error process OK';
        } else {
            success = await finishRecording({ usercode, recordcode });
            message = 'finish record';
        }

        res.status(201).json({
            success,
            message,
        });
    } catch (err) {
        next(err);
    }
});

        
//재시작
router.post('/reset', async (req, res, next) => {
    const {usercode} = req.body;
    try{
        const success = await resetRecord({usercode});
        res.json({
            success
        })
    }catch(err){
        next(err);
    }
});

module.exports = router;
