const wrap = (handler) => async (req, res, next) => {
    try {
        const response = await handler(req, res, next);
        res.json({
            success: true,
            response,
            error: null,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = wrap;