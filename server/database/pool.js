const mysql = require('mysql2/promise');
const config = require('./config')

const pool = mysql.createPool(config);
console.log('create pool ',pool);

module.exports = pool;