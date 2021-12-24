const express = require('express');
const router = express.Router();

const userInfo = {
    1:"user1",
    2:"user2"
}

router.get('/:username', (req, res) => {


});

router.post('/', (req, res,next) => {
    /**
     * {username:
     * code:
     *  record:{err,time,latitude,longitude}}
     */
    const {username, code, record} = req.body;
    if(userInfo[code] !== username){
        return next(new Error('authentication Error'))
    }
    res.json({
        success : true,
        counter:record.counter,
    })
});

router.post('/finish', (req, res) => {});



module.exports = router;
