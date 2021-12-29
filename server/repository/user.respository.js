module.exports = class UserRepository {

    #pool;
    #FindUserSQL = 'select * from USER where usercode = ?';
    #UpdateUserStatusSQL = 'UPDATE USER set status = ? where usercode = ?';

    constructor(pool) {
        this.#pool = pool;
    }
    findUser = async ({ usercode }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindUserSQL, [
                usercode,
            ]);
            await connection.release();
            return rows[0];
        } catch (err) {
            throw new Error('Error: find user');
        }
    };
    updateUserStatus = async ({ usercode, status }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#UpdateUserStatusSQL, [
                status,
                usercode,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            throw new Error('Error: Change User status');
        }
    };
};
