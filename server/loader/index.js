'use strict';

const mysqlLoader = require('./mysql');
const redisLoader = require('./redis');
const expressLoader = require('./express');

const ErrorHandler = (err, req, res, next) => {
    let error = {
        statusCode: err.statusCode,
        message: err.message,
    };

    return res.status(error.statusCode).json({ message: error.message });
};

module.exports = async ({ expressApp }) => {
    try {
        //Redis
        const redis = await redisLoader();
        console.log('Load redis...');

        //Mysql
        const db = await mysqlLoader();
        console.log('Load mysql...');
        
        //Router
        await expressLoader({ expressApp, redis, db });
        console.log('Load Express App Router');

        expressApp.use(ErrorHandler);
    } catch (err) {
        console.log('load error');
    }
};
