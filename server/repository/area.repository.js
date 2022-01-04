module.exports = class CoordRepository {
    //
    #FindAllAreaSQL = 'SELECT * from AREA';
    #CreateAreaSQL =
        'INSERT INTO AREA (areacode, latitude, longitude, description, size) values(?,?,?,"NO_NAME_AREA",?)';

    #pool;
    constructor(pool) {
        this.#pool = pool;
    }

    findAllArea = async () => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(this.#FindAllAreaSQL);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };

    createArea = async ({ newAreaCode, center_coords, size = 10 }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#CreateAreaSQL, [
                newAreaCode,
                center_coords.latitude,
                center_coords.longitude,
                size,
            ]);
            await connection.release();
        } catch (err) {
            throw err;
        }
    };
};
