'use strict';

const TestError = require("../Exception/TestError");

module.exports = async ({expressApp, redis, db}) =>{
    //router들 여기 넣어라..
    expressApp.get('/auth')


    expressApp.get('/errorTest',(req,res)=>{
        throw new TestError('test error',503);
    })
}