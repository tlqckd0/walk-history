const userQuery = require('./queries/user.query');
const pool = require('../database/pool');

const saveUser = async ({ user_id, user_pw, user_name }) => {
    const connection = await pool.getConnection(async (conn) => conn);
    connection.beginTransaction();
    try {
        await connection.query(userQuery.create_user, [
            user_id,
            user_pw,
            user_name,
        ]);
        connection.commit();
        connection.release();
    } catch (err) {
        connection.rollback();
        connection.release();
        console.error(err.message);
        throw err;
    }
};

const findUserByIdPw = async ({ user_id, user_pw }) => {
    const connection = await pool.getConnection(async (conn) => conn);
    connection.beginTransaction();
    try {
        const [rows] = await connection.query(userQuery.find_user, [
            user_id,
            user_pw,
        ]);
        connection.commit();
        connection.release();
        return rows;
    } catch (err) {
        connection.rollback();
        connection.release();
        console.error(err.message);
        throw err;
    }
};

module.exports = {
    saveUser,
    findUserByIdPw,
};
