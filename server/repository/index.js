const mysql = require('mysql2/promise');
const config = require('./config');
const CoordsRepository = require('./coords.repository');
const UserRepository = require('./user.respository');

const pool = mysql.createPool(config);
const userRepository = new UserRepository(pool);
const coordsRepository = new CoordsRepository(pool);

module.exports = {
    userRepository,
    coordsRepository,
};
