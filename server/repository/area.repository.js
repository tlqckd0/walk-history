module.exports = class AreaRepository {

    #pool;

    #FindAreaSQL = `SELECT * FROM user_area WHERE usercode = ? AND latitude = ? AND longitude = ?`;

    #InsertAreaSQL = `INSERT INTO user_area (usercode, latitude, longitude) VALUES(?,?,?)`;

    #AddAreaCountSQL = `UPDATE user_area set count = ? WHERE usercode = ? AND latitude = ? AND longitude = ?`;

    #FindAreaByUserNameSQL = `SELECT latitude, longitude, count FROM user_area a WHERE 
    exists (select 1 from user u where u.username = ? and u.usercode = a.usercode) 
    and a.latitude between ? and ?  
    and a.longitude between ? and ?`;

    #FindAllSQL = `SELECT usercode, latitude, longitude, count  FROM user_area a WHERE  
    a.latitude between ? and ?   
    and a.longitude between ? and ?`;

    constructor(pool) {
        this.#pool = pool;
    }

    FindAndInsertArea = async ({ usercode, latitude, longitude }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAreaSQL, [
                usercode,
                latitude,
                longitude,
            ]);
            //없는 경우 -> INSERT
            if (rows.length === 0) {
                await connection.query(this.#InsertAreaSQL, [
                    usercode,
                    latitude,
                    longitude,
                ]);
            } else {
                //있는 경우 -> COUNT + 1
                const count = rows[0].count + 1;
                await connection.query(this.#AddAreaCountSQL, [
                    count,
                    usercode,
                    latitude,
                    longitude,
                ]);
            }
            await connection.release();
        } catch (err) {
            throw err;
        }
    };

    FindAreaByUsername = async ({ username, bottom, top, left, right }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAreaByUserNameSQL, [
                username,
                bottom,
                top,
                left,
                right,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };

    FindTotalArea = async ({ bottom, top, left, right }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAllSQL, [
                bottom,
                top,
                left,
                right,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };
};
