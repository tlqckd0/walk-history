const express = require('express');
const router = express.Router();

const { getUserInfo } = require('./user.service');

router.get('/:usercode/:username', async (req, res,next) => {
    const { usercode, username } = req.params;
    try {
        const user = await getUserInfo({ usercode, username });
        return res.json(user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
