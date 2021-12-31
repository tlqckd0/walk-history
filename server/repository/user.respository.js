module.exports = class UserRepository {
    #pool;
    #FindAllNameUserSQL = 'SELECT USERNAME FROM USER';
    #FindUserSQL = 'SELECT * from USER where usercode = ?';
    #UpdateUserStatusSQL = 'UPDATE USER set status = ? where usercode = ?';

    constructor(pool) {
        this.#pool = pool;
    }
    findAllUser = async () => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAllNameUserSQL);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };

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
            throw err;
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
            throw err;
        }
    };
};
