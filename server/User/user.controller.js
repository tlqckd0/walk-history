const express = require('express');
const router = express.Router();

const { getUserInfo, findAllUserName } = require('./user.service');

router.get('/', async (req, res, next) => {
    try {
        const result = await findAllUserName();
        return res.json({
            success: true,
            result,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/:usercode/:username', async (req, res, next) => {
    const { usercode, username } = req.params;
    try {
        const result = await getUserInfo({ usercode, username });
        return res.json(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

module.exports = router;
