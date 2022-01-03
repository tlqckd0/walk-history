const express = require('express');
const router = express.Router();
const coordService = require('./coord.service');

router.get('/:recordcode', async (req, res, next) => {
    const { recordcode } = req.params;
    try {
        const result = await coordService.findCoordList({ recordcode });
        res.json({
            success: true,
            result,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
