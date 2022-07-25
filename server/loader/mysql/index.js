'use strict';

const mysql = require('mysql2/promise');
const config = require('./config');

module.exports = async () => {
    const pool = mysql.createPool(config);

    const getConnection = async () => {
        try {
            const conn = await pool.getConnection();
            return conn;
        } catch (error) {
            console.error(`connection error : ${error.message}`);
            return null;
        }
    };

    const releaseConnection = async (conn) => {
        try {
            await conn.release();
        } catch (error) {
            console.error(`release error : ${error.message}`);
        }
    };

    return {
        getConnection,
        releaseConnection,
    };
};
