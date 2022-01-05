const express = require('express');
const router = express.Router();

router.get('/:username/:recordcode/:sw_lat/:sw_lon/:ne_lat/:ne_lon', (req, res, next) => {
    const {username, recordcode,sw_lat,sw_lon,ne_lat,ne_lon} = req.params;
    try {
        //전체 지역 가지고오기.
        console.log(req.params);
        res.send({
            success :true
        })
        
    } catch (err) {
        next(err);
    }
});

module.exports = router;
