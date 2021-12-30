module.exports = class RecordRepository {
    //0.기록중, 1. 기록완료, 2. 기록애러

    #pool;

    #CreateRecordSQL = `INSERT INTO RECORD (USERCODE, STARTTIME, STATUS) VALUES("?",sysdate(),0)`;

    #GetCurrentRecordCodeSQL =
        'SELECT MAX(RECORDCODE) as recordcode from RECORD where USERCODE = ? and STATUS = ?';

    #FinishRecordSQL =
        'UPDATE RECORD set STATUS = ?, ENDTIME = sysdate() where RECORDCODE = ?';

    constructor(pool) {
        this.#pool = pool;
    }

    createRecord = async ({ usercode }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#CreateRecordSQL, [usercode]);
            await connection.release();
        } catch (err) {
            throw new Error(err.message);
        }
    };

    getCurrentRecordWithStatus = async ({ usercode, status }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            const [rows] = await connection.query(
                this.#GetCurrentRecordCodeSQL,
                [usercode, status]
            );
            await connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(err.message);
        }
    };

    finishRecord = async ({ recordcode, status }) => {
        try {
            const connection = await this.#pool.getConnection(
                async (conn) => conn
            );
            await connection.query(this.#FinishRecordSQL, [status, recordcode]);
            await connection.release();
        } catch (err) {
            throw new Error(err.message);
        }
    };
};
