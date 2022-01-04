const mysql = require('mysql2/promise');
const config = require('./config');

const RecordRepository = require('./record.repository');
const UserRepository = require('./user.respository');
const CoordRepository = require('./coord.repository');
const AreaRepository = require('./area.repository');

const pool = mysql.createPool(config);

const userRepository = new UserRepository(pool);
const recordRepository = new RecordRepository(pool);
const coordRepository = new CoordRepository(pool);
const areaRepository = new AreaRepository(pool);

module.exports = {
    userRepository,
    recordRepository,
    coordRepository,
    areaRepository,
};
