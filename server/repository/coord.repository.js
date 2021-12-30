module.exports = class CoordRepository {
    //0.기록중, 1. 기록완료, 2. 기록애러

    #pool;
    #CreateCoordLineSQL =
        'INSERT INTO COORD_LINE (recordcode,counter, from_latitude, from_longitude,to_latitude,to_longitude) VALUES(?,?,?,?,?,?)';
    #FindCoordLineWithRecordCode =
        'SELECT * FROM COORD_LINE where RECORDCODE = ?';
    #DeleteCoordLineWithRecordCodeSQL =
        'DELETE FROM COORD_LINE where RECORDCODE = ?';
    constructor(pool) {
        this.#pool = pool;
    }

    createCoord = async ({ recordcode, counter, from_record, to_record }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#CreateCoordLineSQL, [
                recordcode,
                counter,
                from_record.latitude,
                from_record.longitude,
                to_record.latitude,
                to_record.longitude,
            ]);
            await connection.release();
        } catch (err) {
            throw err;
        }
    };
    findCoordsWithRecordcode = async ({ recordcode }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(
                this.#DeleteCoordLineWithRecordCodeSQL,
                [recordcode]
            );
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };
    deleteCoord = async ({ recordcode }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#FindCoordLineWithRecordCode, [
                recordcode,
            ]);
            await connection.release();
            return rows;
        } catch (err) {
            throw err;
        }
    };
};
